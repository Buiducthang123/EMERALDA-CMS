<template>
  <div class="payment-table-container">
    <a-table :columns="columns" :dataSource="paymentData || []" rowKey="id" class="payment-table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'amount'">
          {{ formatPrice(record.amount) }}
        </template>
        <template v-if="column.key === 'payment_date'">
          {{ record.payment_date ? dayjs(record.payment_date).format('DD/MM/YYYY') : '/' }} 
        </template>
        <template v-if="column.key === 'created_at'">
          {{ dayjs(record.created_at).format('DD/MM/YYYY') }}
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ EPaymentStatusLabel[record.order.status as EPaymentStatus] }}
          </a-tag>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div class="expanded-row">
          <div class="expanded-row-section">
            <h6 class="section-title">Thông tin người dùng</h6>
            <p><strong>Tên người dùng:</strong> {{ record.user.name }}</p>
            <p><strong>Email người dùng:</strong> {{ record.user.email }}</p>
            <p><strong>Số điện thoại:</strong> {{ record.user.phone_number }}</p>
          </div>
          <div class="expanded-row-section">
            <h6 class="section-title">Thông tin đơn hàng</h6>
            <p><strong>Mã đơn đặt phòng:</strong> {{ record.order_id }}</p>
            <p><strong>Tổng giá:</strong> {{ formatPrice(record.order.total_price) }}</p>
            <p><strong>Số tiền phải trả:</strong> {{ formatPrice(record.order.payable_amount) }}</p>
            <p><strong>Trạng thái:</strong> {{ EPaymentStatusLabel[record.order.status as EPaymentStatus] }}</p>
          </div>
          <div class="expanded-row-section">
            <h6 class="section-title">Thông tin người nhận phòng</h6>
            <p><strong>Tên người dùng:</strong> {{ record.order.customer_info.name }}</p>
            <p><strong>Email người dùng:</strong> {{ record.order.customer_info.email }}</p>
            <p><strong>Số điện thoại liên hệ:</strong> {{ record.order.customer_info.phone_number }}</p>
            <p><strong>Ngày sinh:</strong> {{ dayjs(record.order.customer_info.birthday).format('DD/MM/YYYY') }}</p>
          </div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useFetch, useRuntimeConfig } from '#app';
import type { IPayment } from '~/interfaces/IPayment';
import dayjs from '#build/dayjs.imports.mjs';
import { EPaymentStatus, EPaymentStatusLabel } from '~/enums/EPaymentStatus';

const authStore = useAuthStore();
const { setUserInfo, setAccessToken } = authStore;

const access_token = computed(() => authStore.accessToken);

const { data: paymentData } = await useFetch<IPayment[]>('api/payment', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: `Bearer ${access_token.value}`
  },
  query: {
    'p[]': ['user', 'order'],
    'latest': true
  }
});

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Mã đơn đặt phòng',
    dataIndex: 'order_id',
    key: 'order_id'
  },
  {
    title: 'Mã người dùng',
    dataIndex: 'user_id',
    key: 'user_id'
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Mã giao dịch',
    dataIndex: 'transaction_id',
    key: 'transaction_id'
  },
  {
    title: 'Ngày thanh toán',
    dataIndex: 'payment_date',
    key: 'payment_date'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    key: 'created_at'
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const getStatusColor = (status: EPaymentStatus) => {
  switch (status) {
    case EPaymentStatus.DEPOSIT:
      return 'orange';
    case EPaymentStatus.PAID:
      return 'green';
    case EPaymentStatus.CANCELLED:
      return 'red';
    default:
      return 'default';
  }
};

</script>

<style scoped>
.payment-table-container {
  padding: 20px;
  background-color: #f9f9f9;
}

.payment-table {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.expanded-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.expanded-row-section {
  flex: 1;
  min-width: 200px;
}

.section-title {
  font-size: 1.2em;
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.font-bold {
  font-weight: bold;
}
</style>