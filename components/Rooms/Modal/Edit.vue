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
              <a-select-option v-for="(type, index) in roomType" :key="type.id" :value="type.id">{{ type.name
                }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="w-full" required>
            <template #label>
              <span class="mr-2 font-bold">Trạng thái</span>
            </template>
            <a-select v-model:value="form.status" size="large">
              <a-select-option value="">Chọn trạng thái</a-select-option>
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
      </a-form>
      <div class="mb-4">
        <span class="mr-2 font-bold mb-4 inline-block">Ảnh đại diện</span>
        <div class="flex gap-10 overflow-hidden">
          <NuxtImg v-if="room && room?.main_image && !(form.main_image)" :src="room?.main_image"
            class="w-[40%] rounded-lg" />
          <NuxtImg v-else-if="form.main_image" :src="form.main_image" class="w-[40%] rounded-lg" />
          <span v-else>Chưa có ảnh vui lòng tải ảnh lên</span>
          <a-upload :file-list="fileList" accept="image/*" @change="handleChange" :max-count="1"
            class="text-wrap">
            <a-button :loading="loading" :disabled="loading">
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
const fileList = ref<UploadProps['fileList']>([])
const handleChange = (info: UploadChangeParam) => {
  console.log(info.fileList);  
  handleUploadImg(info.fileList);
};


const handleUploadImg = async (fileList: any[]) => {
  loading.value = true;
  const apiKey = '14cc7136f05a039beb83d8183385e78b';
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  for (let file of fileList) {
    if (file.uploaded) continue; // Skip already uploaded files

    const formData = new FormData();
    const base64String = await toBase64(file.originFileObj);
    formData.append('image', base64String as Blob);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      form.value.main_image = result.data.url;
      file.uploaded = true; // Mark file as uploaded
      console.log('Image uploaded:', result.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
  loading.value = false;
};

const toBase64 = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result !== null) {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.onerror = (error) => reject(error);
  });
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
</style>