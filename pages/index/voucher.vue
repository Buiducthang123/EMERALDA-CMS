<template>
  <div class="voucher-container p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Quản Lý khuyến mãi</h1>
    <a-button type="primary" @click="handleCreateVoucher">Thêm Voucher</a-button>
    <a-table :columns="columns" :dataSource="vouchers || []" rowKey="id" class="mt-6">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'main_image'">
          <a-image v-if="text" :src="text" class="max-h-40" />
          <span v-else>Không có ảnh</span>
        </template>
        <template v-else-if="column.dataIndex === 'actions'">
          <a-space>
            <a-button type="primary" @click="handleDetailVoucher(record as IVoucher)">Xem</a-button>
            <a-button type="dashed" @click="handleEditVoucher(record as IVoucher)">Sửa</a-button>
            <a-popconfirm
              title="Bạn có chắc chắn muốn xóa voucher này không?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteVoucher(record.id)"
            >
              <a-button danger>Xóa</a-button>
            </a-popconfirm>
          </a-space>
        </template>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>

    <LazyVouchersCreate :open="isCreateVoucherModalOpen" @handle-cancel="()=>{isCreateVoucherModalOpen = false}" @refresh-voucher="fetchVouchers" />
    <VouchersEdit v-if="isEditVoucherModalOpen" :open="isEditVoucherModalOpen" :voucher="selectedVoucher" @handle-cancel="isEditVoucherModalOpen = false" @refresh-voucher="fetchVouchers" />
    <VouchersDetail :open="isDetailVoucherModalOpen" :voucher="selectedVoucher" @handle-cancel="isDetailVoucherModalOpen = false" @refresh-voucher="fetchVouchers" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useAuthStore } from '~/stores/auth';
import type { IVoucher } from '~/interfaces/IVoucher';

const authStore = useAuthStore();
const token = computed(() => authStore.accessToken);

const columns = [
  { title: 'Tên Voucher', dataIndex: 'name', key: 'name' },
  { title: 'Ảnh đại diện', dataIndex: 'main_image', key: 'main_image' },
  // { title: 'Mô tả', dataIndex: 'description', key: 'description' },
  { title: 'Mã Voucher', dataIndex: 'code', key: 'code' },
  { title: '% giảm giá', dataIndex: 'discount_amount', key: 'discount_amount' },
  { title: 'Ngày bắt đầu hiệu lực', dataIndex: 'valid_from', key: 'valid_from' },
  { title: 'Ngày hết hạn', dataIndex: 'valid_until', key: 'valid_until' },
  { title: 'Hành động', key: 'actions', dataIndex: 'actions' },
];

const config = useRuntimeConfig();
const { data: vouchers, refresh: fetchVouchers } = await useFetch<IVoucher[]>('/api/vouchers', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token.value}`,
  },
  baseURL: config.public.baseURL,
});

const deleteVoucher = async (voucherId: number) => {
  try {
    await $fetch(`/api/vouchers/${voucherId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      baseURL: config.public.baseURL,
    });
    message.success('Voucher đã được xóa thành công');
    fetchVouchers();
  } catch (error) {
    console.error('Failed to delete voucher:', error);
    message.error('Xóa voucher thất bại');
  }
};

const isCreateVoucherModalOpen = ref(false);
const handleCreateVoucher = () => {
  isCreateVoucherModalOpen.value = true;
};

const isEditVoucherModalOpen = ref(false);
const selectedVoucher = ref<IVoucher>();
const handleEditVoucher = (voucher: IVoucher) => {
  selectedVoucher.value = voucher;
  isEditVoucherModalOpen.value = true;
};

const isDetailVoucherModalOpen = ref(false);

const handleDetailVoucher = (voucher: IVoucher) => {
  selectedVoucher.value = voucher;
  isDetailVoucherModalOpen.value = true;
};
</script>

<style scoped>
.voucher-container {
  padding: 20px;
}

.mt-6 {
  margin-top: 1.5rem;
}
</style>