<template>
  <a-modal
    v-model:open="props.open"
    title="Xác nhận xóa"
    @ok="handleDelete"
    @cancel="emit('handleCancel')"
    okText="Xóa"
    cancelText="Hủy"
  >
    <p>Bạn có chắc chắn muốn xóa loại phòng này không?</p>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useAuthStore } from '#imports';
import { message } from 'ant-design-vue';

const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const props = defineProps<{
  open: boolean;
  roomTypeId: number;
}>();

const emit = defineEmits([ 'handleCancel', 'refreshRoomTypes']);

const handleDelete = async () => {
  await $fetch.raw(`/api/room-types/${props.roomTypeId}`, {
    method: 'DELETE',
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.value}`
    },
    onResponse: ({ response }) => {
      if (response.ok) {
        message.success('Xóa loại phòng thành công');
        emit('refreshRoomTypes');
      }
      else {
        message.error(response._data.message || 'Xóa loại phòng thất bại');
      }
      emit('handleCancel')
      
    },
  });
  
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>