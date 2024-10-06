<template>
  <a-modal v-model:open="props.open" title="Chỉnh Sửa Phòng" @ok="handleUpdate" @cancel="emit('handleCancel')"
    :width="800" style="top:40px">
    <div class="h-[60vh]">
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
import type { IRoom } from '~/interfaces/IRoom';
import type { IRoomType } from '~/interfaces/IRoomType';

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
};

const form = reactive<IFormEditRoom>({
  room_number: '',
  status: undefined,
  room_type_id: 0,
  price: 0,
  thumbnails: [],
  description: '',
});

watch(() => props.room, (room) => {
  if (room) {
    form.room_number = room.room_number;
    form.status = room.status;
    form.room_type_id = room.room_type_id;
    form.price = room.price;
  }
}, { immediate: true })

const { data: roomType } = await useFetch<IRoomType[] | null>('/api/room-types', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const auth = useAuthStore();
const { accessToken } = auth;

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
.ck-editor__editable{
  height: 100px;
}
</style>