<template>
  <a-modal v-model:open="props.open" title="Chỉnh Sửa Phòng" @ok="handleUpdate" @cancel="emit('handleCancel')"
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
              <a-select-option value="">Chọn loại phòng</a-select-option>
              <a-select-option v-for="(type, index) in roomType" :key="type.id" :value="type.id">{{ type.name
                }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="w-full" required>
            <template #label>
              <span class="mr-2 font-bold">Trạng thái</span>
            </template>
            <a-select v-model:value="form.status" size="large">
              <a-select-option :value="undefined">Chọn trạng thái</a-select-option>
              <a-select-option :value="ERoomStatus.AVAILABLE">{{ RoomStatusText[ERoomStatus.AVAILABLE]
                }}</a-select-option>
              <a-select-option :value="ERoomStatus.BOOKED">{{ RoomStatusText[ERoomStatus.BOOKED] }}</a-select-option>
              <a-select-option :value="ERoomStatus.MAINTENANCE">{{ RoomStatusText[ERoomStatus.MAINTENANCE]
                }}</a-select-option>
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
              <a-checkbox class="mb-4" v-for="(feature, index) in features" :key="index" :value="feature.id">{{
                feature.name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </div>

        <div>
          <a-form-item required>
            <template #label>
              <span class="mr-2 font-bold">Tiện nghi</span>
            </template>
            <a-checkbox-group v-model:value="form.amenities">
              <a-checkbox class="my-2" v-for="(amenity, index) in amenities" :key="index" :value="amenity.id">{{
                amenity.name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </div>
        <div class="mb-4">
          <span class="mr-2 font-bold mb-4 inline-block">Ảnh đại diện</span>
          <div class="flex gap-10 overflow-hidden">
            <a-image :width="300" v-if="room && room?.main_image && !(form.main_image)" :src="room?.main_image"
              class="rounded-lg"
              fallback="data:image/png;base64,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" />
            <a-image :width="300" v-else-if="form.main_image" :src="form.main_image" class="rounded-lg"
              fallback="data:image/png;base64,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" />
            <span v-else>Chưa có ảnh vui lòng tải ảnh lên</span>
            <a-upload :file-list="fileList" accept="image/*" @change="handleChange" :max-count="1" class="text-wrap">
              <a-button :loading="loading" :disabled="loading">
                Chỉnh sửa ảnh chính
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
import { ref, defineProps, defineEmits } from 'vue';
import { ERoomStatus, RoomStatusText } from '~/enums/ERoomStatus';
import type { IRoom } from '~/interfaces/IRoom';
import type { IRoomType } from '~/interfaces/IRoomType';
import type { IAmenity } from '~/interfaces/IAmenity';
import type { IFeature } from '~/interfaces/IFeature';
import { type UploadChangeParam, type UploadProps } from 'ant-design-vue';
import { handleUploadImg } from '~/utils/file-upload';

const props = defineProps<{
  room: IRoom | undefined;
  open: boolean;
}>();

const emit = defineEmits(['handleOk', 'handleCancel', 'refreshRoom']);

interface IFormEditRoom {
  room_number: string;
  room_type_id: number;
  status: number | undefined;
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

const form = reactive<IFormEditRoom>({
  room_number: '',
  status: undefined,
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

watch(() => props.room, (room) => {
  if (room) {
    form.room_number = room.room_number;
    form.status = room.status;
    form.room_type_id = room.room_type_id;
    form.price = room.price;
    form.amenities = room.amenities || [];
    form.features = room.features || [];
    form.main_image = room.main_image || '';
    form.adults = room.adults || 0;
    form.children = room.children || 0;
    form.area = room.area || 0;
    form.description = room.description || '';
    form.thumbnails = room.thumbnails || [];
  }
}, { immediate: true })

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

const auth = useAuthStore();
const { accessToken } = auth;

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
const fileList = ref<UploadProps['fileList']>([])

const handleChange = async (info: UploadChangeParam) => {
  form.main_image = await handleUploadImg(info.fileList, loading.value) || '';
};

const handleUpdate = async() => {
    try {
     const result = await $fetch.raw(`/api/rooms/${props.room?.id}`, {
        method: 'PATCH',
        baseURL: useRuntimeConfig().public.baseURL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: form
      });
      if(result.ok){
        message.success('Cập nhật phòng thành công');
        emit('refreshRoom')
        emit('handleCancel');
      }
    } catch (e) {
      console.log(e);
      message.error('Có lỗi xảy ra');
    }
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

.ck-editor__editable{
  height: 100px;
}
</style>