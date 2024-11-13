<template>
  <a-modal v-model:open="props.open" title="Tạo Phòng Mới" @ok="handleCreate" @cancel="emit('handleCancel')"
    :width="800" style="top:40px">
    <div class="h-[60vh]">
      <a-form :model="form" layout="vertical" ref="formRef">
        <a-form-item required name="room_number"
        :rules="[
          { required: true, message: 'Vui lòng nhập tên phòng!' },
          { max: 10, message: 'Tên phòng không được vượt quá 10 ký tự!' }
          ]"
        >
          <template #label>
            <span class="mr-2 font-bold">Tên Phòng</span>
          </template>
          <a-input v-model:value="form.room_number" size='large' />
        </a-form-item>
        <div class="flex gap-6">
          <a-form-item class="w-full" required name="room_type_id"
          :rules="[
            { required: true, message: 'Vui lòng chọn loại phòng!' }
            ]"
          >
            <template #label>
              <span class="mr-2 font-bold">Loại Phòng</span>
            </template>
            <a-select v-model:value="form.room_type_id" size="large">
              <a-select-option :value="undefined">Chọn loại phòng</a-select-option>
              <a-select-option v-for="(type, index) in roomType" :key="type.id" :value="type.id">{{ type.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="w-full" required>
            <template #label>
              <span class="mr-2 font-bold">Trạng thái</span>
            </template>
            <a-select v-model:value="form.status" size="large">
              <a-select-option :value="ERoomStatus.AVAILABLE">{{ RoomStatusText[ERoomStatus.AVAILABLE] }}</a-select-option>
              <a-select-option :value="ERoomStatus.MAINTENANCE">{{ RoomStatusText[ERoomStatus.MAINTENANCE] }}</a-select-option>
            </a-select>
          </a-form-item>
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
import { ERoomStatus, RoomStatusText } from '~/enums/ERoomStatus';
import type { IRoomType } from '~/interfaces/IRoomType';
import { useAuthStore } from '#imports';

const formRef = ref();
const authStore = useAuthStore();
const { accessToken } = authStore;

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['handleOk', 'handleCancel', 'refreshRoom']);

interface IFormCreateRoom {
  room_number: string;
  room_type_id: number|undefined;
  status: number;
  description?: string;
};

const form = reactive<IFormCreateRoom>({
  room_number: '',
  status: ERoomStatus.AVAILABLE,
  room_type_id: undefined,
  description: '',
});

const { data: roomType } = await useFetch<IRoomType[] | null>('/api/room-types', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleCreate = async () => {
  await formRef.value.validate();
  await $fetch.raw('/api/rooms', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: form,
      onResponse: ({ response }) => {
        if (response.ok) {
          emit('handleOk');
          emit('refreshRoom');
          resetForm();
          message.success('Tạo phòng thành công');
        }
        else {
          message.error(response._data.message || 'Có lỗi xảy ra');
        }
      }
    });
};

const resetForm = () => {
  form.room_number = '';
  form.status = ERoomStatus.AVAILABLE;
  form.room_type_id = 0;
  form.description = '';
};
</script>

<style scoped>

</style>