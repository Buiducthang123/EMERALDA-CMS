<template>
  <a-modal v-model:open="props.open" title="Tạo Phòng Mới" @ok="handleCreate" @cancel="emit('handleCancel')"
    :width="800" style="top:40px" :bodyStyle="{ ...modalStyle, 'overflow-y': 'scroll' }">
    <div class="h-[60vh overflow-y-scroll]">
      <a-form :model="form" layout="vertical">
        <a-form-item required>
          <template #label>
            <span class="mr-2 font-bold">Tên Phòng</span>
          </template>
          <a-input v-model:value="form.room_number" size='large' />
        </a-form-item>
        <div class="flex gap-6 ">
          <a-form-item class="w-full" required>
            <template #label>
              <span class="mr-2 font-bold">Loại Phòng</span>
            </template>
            <a-select v-model:value="form.room_type_id" size="large">
              <a-select-option :value="0">Chọn loại phòng</a-select-option>
              <a-select-option v-for="(type, index) in roomType" :key="type.id" :value="type.id">{{ type.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="w-full" required>
            <template #label>
              <span class="mr-2 font-bold">Trạng thái</span>
            </template>
            <a-select v-model:value="form.status" size="large">
              <a-select-option :value="ERoomStatus.AVAILABLE">{{ RoomStatusText[ERoomStatus.AVAILABLE] }}</a-select-option>
              <a-select-option :value="ERoomStatus.BOOKED">{{ RoomStatusText[ERoomStatus.BOOKED] }}</a-select-option>
              <a-select-option :value="ERoomStatus.MAINTENANCE">{{ RoomStatusText[ERoomStatus.MAINTENANCE] }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="flex gap-10">
          <a-form-item required>
            <template #label>
              <span class="mr-2 font-bold">Giá</span>
            </template>
            <a-input-number v-model:value="form.price" min="0" />
          </a-form-item>
          <a-form-item required>
            <template #label>
              <span class="mr-2 font-bold">Người lớn</span>
            </template>
            <a-input-number v-model:value="form.adults" min="0" />
          </a-form-item>
          <a-form-item required>
            <template #label>
              <span class="mr-2 font-bold">Trẻ em</span>
            </template>
            <a-input-number v-model:value="form.children" min="0" />
          </a-form-item>
          <a-form-item required>
            <template #label>
              <span class="mr-2 font-bold">Diện tích</span>
            </template>
            <a-input-number v-model:value="form.area" min="0" />
            <span> m<sup>2</sup></span>
          </a-form-item>
        </div>

        <div>
          <a-form-item required>
            <template #label>
              <span class="mr-2 font-bold">Đặc tính</span>
            </template>
            <a-checkbox-group v-model:value="form.features">
              <a-checkbox class="mb-4" v-for="(feature, index) in features" :key="index" :value="feature.id">{{ feature.name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </div>

        <div>
          <a-form-item required>
            <template #label>
              <span class="mr-2 font-bold">Tiện nghi</span>
            </template>
            <a-checkbox-group v-model:value="form.amenities">
              <a-checkbox class="my-2" v-for="(amenity, index) in amenities" :key="index" :value="amenity.id">{{ amenity.name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </div>
        <div class="mb-4">
          <span class="mr-2 font-bold mb-4 inline-block">Ảnh đại diện</span>
          <div class="flex gap-10 overflow-hidden">
            <a-image :width="300" v-if="form.main_image" :src="form.main_image" class="rounded-lg max-h-[180px] object-cover"/>
            <a-image :width="300" v-else src="https://placehold.co/300x180" class="rounded-lg"/>
        
            <a-upload :file-list="fileList" accept="image/*" @change="handleChange" :max-count="1" class="text-wrap">
              <a-button :loading="loading" :disabled="loading">
                Tải ảnh lên
              </a-button>
            </a-upload>
          </div>
        </div>
        <div>
          <span class="mr-2 font-bold mb-2 inline-block">Ảnh mô tả thêm</span>
          <Slider v-model:value="form.thumbnails" :edit="true" />
        </div>

        <a-form-item>
          <template #label>
              <span class="mr-2 font-bold mt-4">Mô tả</span>
          </template>
          <CkEditor v-model:value="form.description" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits } from 'vue';
import { ERoomStatus, RoomStatusText } from '~/enums/ERoomStatus';
import type { IRoomType } from '~/interfaces/IRoomType';
import type { IAmenity } from '~/interfaces/IAmenity';
import type { IFeature } from '~/interfaces/IFeature';
import { type UploadChangeParam, type UploadProps } from 'ant-design-vue';
import { handleUploadImg } from '~/utils/file-upload';
import { useAuthStore } from '#imports';

const authStore = useAuthStore();
const { accessToken } = authStore;

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['handleOk', 'handleCancel', 'refreshRoom']);

interface IFormCreateRoom {
  room_number: string;
  room_type_id: number;
  status: number;
  price: number;
  description?: string;
  thumbnails: string[];
  amenities: string[];
  features: string[];
  main_image: string;
  adults: number;
  children: number;
  area: number;
};

const form = reactive<IFormCreateRoom>({
  room_number: '',
  status: ERoomStatus.AVAILABLE,
  room_type_id: 0,
  price: 0,
  thumbnails: [],
  amenities: [],
  features: [],
  main_image: '',
  adults: 0,
  children: 0,
  area: 0,
  description: '',
});

const { data: roomType } = await useFetch<IRoomType[] | null>('/api/room-types', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const { data: amenities } = await useFetch<IAmenity[]>('/api/amenities', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
});

const { data: features } = await useFetch<IFeature[]>('/api/features', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
});

const modalStyle = { height: '70vh', padding: '20px' };
const loading = ref(false);
// File upload
const fileList = ref<UploadProps['fileList']>([]);

const handleChange = async (info: UploadChangeParam) => {
  form.main_image = await handleUploadImg(info.fileList, loading.value) || '';
};

const handleCreate = async () => {
  try {
    const result = await $fetch.raw('/api/rooms', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    });
    if (result.ok) {
      message.success('Tạo phòng thành công');
      emit('refreshRoom');
      emit('handleCancel');
      resetForm();
    }
  } catch (e) {
    console.log(e);
    message.error('Có lỗi xảy ra');
  }
};

const resetForm = () => {
  form.room_number = '';
  form.status = ERoomStatus.AVAILABLE;
  form.room_type_id = 0;
  form.price = 0;
  form.thumbnails = [];
  form.amenities = [];
  form.features = [];
  form.main_image = '';
  form.adults = 0;
  form.children = 0;
  form.area = 0;
  form.description = '';
};
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.ck-editor__editable {
  height: 100px;
}
</style>