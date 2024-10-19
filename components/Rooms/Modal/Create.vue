<template>
  <a-modal v-model:open="props.open" title="Tạo Phòng Mới" @ok="handleCreate" @cancel="emit('handleCancel')"
    :width="800" style="top:40px">
    <div class="h-[60vh]">
      <a-form :model="form" layout="vertical">
        <a-form-item required>
          <template #label>
            <span class="mr-2 font-bold">Tên Phòng</span>
          </template>
          <a-input v-model:value="form.room_number" size='large' />
        </a-form-item>
        <div class="flex gap-6">
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
  description?: string;
};

const form = reactive<IFormCreateRoom>({
  room_number: '',
  status: ERoomStatus.AVAILABLE,
  room_type_id: 0,
  description: '',
});

const { data: roomType } = await useFetch<IRoomType[] | null>('/api/room-types', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const modalStyle = { height: '70vh', padding: '20px' };

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
  form.description = '';
};
</script>

<style scoped>

</style>