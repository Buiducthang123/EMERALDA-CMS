<template>
  <div>
    <!-- Modal chi tiết user -->
    <a-modal
      v-model:visible="isModalVisible"
      title="Chi tiết người dùng"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"
      :footer="false"
    >
      <div class="mt-6">
        <div class=" flex items-center mb-4 gap-6">
         <a-image :width="100" :height="100" class="object-cover overflow-hidden w-24 h-24 rounded-full mr-4 border-2 border-gray-300" :src="props.user?.avatar || defaultAvatar" alt="Avatar" />
       
          <div class="profile-info text-left">
            <h2 class="text-2xl font-bold text-gray-800">{{ props.user?.name }}</h2>
            <p class="text-gray-600">{{ props.user?.email }}</p>
          </div>
        </div>
        <div class="profile-details mt-4 text-base">
          <p class="mb-2 text-gray-700"><strong class="font-semibold">Địa chỉ:</strong> {{ props.user?.address||'chưa có' }}</p>
          <p class="mb-2 text-gray-700"><strong class="font-semibold">Ngày sinh:</strong> {{ props.user?.birthday?formatDate(props.user?.birthday):"Chưa có" }}</p>
          <p class="mb-2 text-gray-700"><strong class="font-semibold">Vai trò:</strong> {{ props.user?.role }}</p>
          <p class="mb-2 text-gray-700"><strong class="font-semibold">Trạng thái:</strong>
            <span :class="props.user?.status == EAccountStatus.Active ? 'text-green-500' : 'text-red-500'">
              {{ props.user?.status == EAccountStatus.Active ? ' Hoạt động' : ' Tạm khóa' }}
            </span>
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { EAccountStatus } from '~/enums/AccountStatus';
import { EUserRole } from '~/enums/EUserRole';
import type { IUser } from '~/interfaces/IUser';

const props = defineProps<{
  user: IUser | undefined;
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'refreshAmenity']);

const defaultAvatar = 'https://via.placeholder.com/150';

const isModalVisible = ref(props.visible);

watch(() => props.visible, (newVal) => {
  isModalVisible.value = newVal;
});

watch(isModalVisible, (newVal) => {
  emit('update:visible', newVal);
});

const handleOk = () => {
  isModalVisible.value = false;
};

const handleCancel = () => {
  isModalVisible.value = false;
};

const formatDate = (date: string | undefined): string => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};
</script>

<style scoped>

</style>