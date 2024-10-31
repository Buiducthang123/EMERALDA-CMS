<template>
  <a-modal
    v-model:open="isVisible"
    :title="isLocking ? 'Xác nhận khóa người dùng' : 'Xác nhận mở khóa người dùng'"
    @ok="handleOk"
    @cancel="handleCancel"
    :okText="isLocking ? 'Khóa' : 'Mở khóa'"
    :okType="isLocking ? 'danger' : 'primary'"
    cancelText="Hủy"
  >
    <div class="space-y-4">
      <p>
        Bạn có chắc chắn muốn 
        <b>{{ isLocking ? 'khóa' : 'mở khóa' }}</b> 
        người dùng <b>{{ user?.name }}</b>?
      </p>
      <a-alert 
        v-if="isLocking" 
        message="Người dùng này sẽ không thể truy cập trang web nữa!" 
        type="warning" 
        show-icon 
      />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { EAccountStatus } from '~/enums/AccountStatus';
import type { IUser } from '~/interfaces/IUser';

const props = defineProps<{
  user: IUser | undefined;
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'lockUser', 'unlockUser','refreshUser']);

const isVisible = ref(props.visible);

const isLocking = props.user?.status == EAccountStatus.Active;

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
});

watch(isVisible, (newVal) => {
  emit('update:visible', newVal);
});

 const auth = useAuthStore();
 const accessToken = auth.accessToken;

const handleOk = async() => {
  const status = props.user?.status == EAccountStatus.Active ? EAccountStatus.Blocked : EAccountStatus.Active;
  try {
    const result = await $fetch.raw('api/users/update/' + props.user?.id, {
      method: 'PATCH',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ status })
    });
    if (result.ok) {
      message.success('Câp nhật trạng thái người dùng thành công!');
      emit('refreshUser');
    }
    
  }
  catch (error) {
    console.error(error);
    message.error('Có lỗi xảy ra, vui lòng thử lại sau!');
  }

  isVisible.value = false;
};

const handleCancel = () => {
  isVisible.value = false;
};
</script>