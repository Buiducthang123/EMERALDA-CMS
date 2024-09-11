<template>
  <a-modal v-model:open="open" title="Chỉnh Sửa Phòng" @ok="handleOk" @cancel="handleCancel" :width="800"
           style="top:40px" :bodyStyle="{ ...modalStyle, 'overflow-y': 'scroll' }">
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
            <a-select v-model:value="form.room_type" size="large">
              <a-select-option value="">Chọn loại phòng</a-select-option>
              <a-select-option v-for="(type, index) in roomType" :key="type.id" :value="type.id">{{ type.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="w-full" required>
            <template #label>
              <span class="mr-2 font-bold">Trạng thái</span>
            </template>
            <a-select v-model:value="form.status" size="large">
              <a-select-option value="">Chọn trạng thái</a-select-option>
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
      </a-form>
      <div class="mb-4">
        <span class="mr-2 font-bold mb-4 inline-block">Ảnh đại diện</span>
        <div class="flex gap-10 overflow-hidden">
          <NuxtImg v-if="room && room?.main_image && !(fileList?.length ?? 0 <= 0)" :src="room?.main_image" class="w-[40%] rounded-lg" />
          <NuxtImg v-else-if="fileList && fileList?.length >0" :src="fileImageUrls" class="w-[40%] rounded-lg" />
          <span v-else>Chưa có ảnh vui lòng tải ảnh lên</span>
          <a-upload v-model:file-list="fileList" name="file" accept="image/*" :max-count="1"

                    @change="handleChange">
            <a-button>
              <upload-outlined></upload-outlined>
              Chỉnh sửa ảnh chính
            </a-button>

            <template #itemRender="{ file, actions }">
              <div class="mt-2 flex gap-2">
                <p class="leading-7" :style="file.status === 'error' ? 'color: red' : ''">
                  <span>{{ file.name }}</span>
                  <Icon class="text-black text-xl mb-[-4px] ml-4 cursor-pointer" name="i-material-symbols-delete-outline" @click="actions.remove"/>
                </p>
              </div>
            </template>
          </a-upload>
        </div>
      </div>
      <div>
        <span class="mr-2 font-bold mb-4 inline-block">Ảnh mô tả thêm</span>
        <Slider />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ERoomStatus, RoomStatusText } from '~/enums/ERoomStatus';
import type { IRoom } from '~/interfaces/IRoom';
import type { IRoomType } from '~/interfaces/IRoomType';
import type { IAmenity } from '~/interfaces/IAmenity';
import type { IFeature } from '~/interfaces/IFeature';

import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

const authStore = useAuthStore();
const { accessToken } = authStore;

const props = defineProps<{
  room: IRoom | null;
  open: boolean;
}>();

const open = ref(props.open);
const emit = defineEmits(['update:open', 'save']);

const form = ref({
  room_number: '',
  room_type: '',
  status: '',
  price: 0,
  amenities: [],
  features: [],
  main_image: '',
  adults: 0,
  children: 0,
  area: 0
});

watch(
  () => props.room,
  (newRoom) => {
    if (newRoom) {
      form.value = { ...newRoom };
    }
  },
  { immediate: true }
);

const handleOk = () => {
  emit('save', form.value);
  emit('update:open', false);
};

const handleCancel = () => {
  emit('update:open', false);
};

const { data: roomType } = await useFetch<IRoomType[] | null>('/api/room-types', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${accessToken}`
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

// File upload
const fileList = ref<UploadProps['fileList']>([]);
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

//viết hàm objectgenderimgUrl

const fileImageUrls = computed(() => {
  return fileList.value && fileList.value[0]?.originFileObj ? URL.createObjectURL(fileList.value[0].originFileObj) : '';
});

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
</style>