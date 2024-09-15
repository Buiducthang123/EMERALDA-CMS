<template>
  <a-modal v-model:open="props.open" title="Xóa Phòng" @ok="handleDelete" @cancel="emit('handleCancel')"
    :width="600">
    <div>
      <p>Bạn có chắc chắn muốn xóa phòng này không?</p>
      <p><strong>Tên Phòng:</strong> {{ props.room?.room_number }}</p>
      <p><strong>Loại Phòng:</strong> {{ props.room?.room_type.name }}</p>
      <p><strong>Trạng thái:</strong> {{ RoomStatusText[props.room?.status] }}</p>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ERoomStatus, RoomStatusText } from '~/enums/ERoomStatus';
import type { IRoom } from '~/interfaces/IRoom';
import { useAuthStore } from '#imports';

const authStore = useAuthStore();
const { accessToken } = authStore;

const props = defineProps<{
  room: IRoom ;
  open: boolean;
}>();

const emit = defineEmits(['handleOk', 'handleCancel', 'refreshRoom']);

const handleDelete = async () => {
  try {
    if (props.room.status!=ERoomStatus.BOOKED){
        const result = await $fetch.raw(`/api/rooms/${props.room?.id}`, {
          method: 'DELETE',
          baseURL: useRuntimeConfig().public.baseURL,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (result.ok) {
          message.success('Xóa phòng thành công');
          emit('refreshRoom');
          emit('handleCancel');
        }
    }
    else{
        message.error('Phòng đang được đặt không thể xóa');
    }
  } catch (e) {
    console.log(e);
    message.error('Có lỗi xảy ra');
  }
};
</script>

<style scoped>
/* Thêm style nếu cần */
</style>