<template>
  <div class="booking-table-container ">
    <h6 class="mb-8 text-xl font-semibold">Danh sách đặt phòng</h6>
    <div class="filters">
      <a-input
        v-model:value="searchText"
        placeholder="Tìm kiếm theo mã đơn, tên phòng, người dùng..."
        class="filter-input"
      />
      <a-select
        v-model:value="selectedStatus"
        placeholder="Lọc theo trạng thái"
        class="filter-select"
        allowClear
      >
        <a-select-option v-for="(label, value) in EBookingStatusText" :key="value" :value="value">
          {{ label }}
        </a-select-option>
      </a-select>
      <a-select
        v-model:value="checkInFilter"
        placeholder="Lọc theo ngày nhận phòng"
        class="filter-select"
        allowClear
      >
        <a-select-option value="all">Hiển thị tất cả</a-select-option>
        <a-select-option value="today">Có thể nhận phòng hôm nay</a-select-option>
      </a-select>
    </div>
    <a-table :columns="columns" :dataSource="filteredBookings" rowKey="id" class="booking-table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'room'">
          {{ record.room.room_number }}
        </template>
        <template v-if="column.key === 'check_in_date'">
          {{ dayjs(record.check_in_date).format('DD/MM/YYYY') }}
        </template>
        <template v-if="column.key === 'check_out_date'">
          {{ dayjs(record.check_out_date).format('DD/MM/YYYY') }}
        </template>
        <template v-if="column.key === 'total_price'">
          {{ formatPrice(record.total_price) }}
        </template>
        <template v-if="column.key === 'paid_amount'">
          {{ formatPrice(record.paid_amount) }}
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ EBookingStatusText[record.status as keyof typeof EBookingStatusText] }}  
          </a-tag>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div class="expanded-row">
          <div class="expanded-row-section">
            <h6 class="section-title">Thông tin đặt phòng</h6>
            <p><strong>Mã đơn đặt phòng:</strong> {{ record.order_id }}</p>
            <p><strong>Mã người dùng:</strong> {{ record.user_id }}</p>
            <p><strong>Số phòng:</strong> {{ record.room.room_number }}</p>
            <p><strong>Ngày nhận phòng:</strong> {{ dayjs(record.check_in_date).format('DD/MM/YYYY') }}</p>
            <p><strong>Ngày trả phòng:</strong> {{ dayjs(record.check_out_date).format('DD/MM/YYYY') }}</p>
            <p><strong>Thành tiền:</strong> {{ formatPrice(record.total_price) }}</p>
            <p><strong>Số tiền đã thanh toán:</strong> {{ formatPrice(record.paid_amount) }}</p>
            <p><strong>Trạng thái:</strong> {{ EBookingStatusText[record.status as keyof typeof EBookingStatusText] }}</p>
            <p><strong>Mô tả phòng:</strong> {{ record.room.description }}</p>
          </div>
          <div class="expanded-row-section">
            <h6 class="section-title">Thông tin người đặt phòng</h6>
            <p><strong>Tên người dùng:</strong> {{ record.user.name }}</p>
            <p><strong>Email người dùng:</strong> {{ record.user.email }}</p>
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
import { ref, computed, h } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useFetch, useRuntimeConfig } from '#app';
import type { IBooking } from '~/interfaces/IBooking';
import dayjs from '#build/dayjs.imports.mjs';
import { EBookingStatusText } from '~/enums/EBookingStatus';

const authStore = useAuthStore();
const { setUserInfo, setAccessToken } = authStore;

const access_token = computed(() => authStore.accessToken);

const { data: bookings } = await useFetch<IBooking[]>('api/bookings', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: `Bearer ${access_token.value}`
  },
  query: {
    'p[]': ['room', 'user', 'order'],
    'latest': true
  }
});

const searchText = ref('');
const selectedStatus = ref<number>();
const checkInFilter = ref<string>('all');

const filteredBookings = computed(() => {
  if (!bookings.value) return [];
  return bookings.value.filter((booking) => {
    const matchesSearchText = searchText.value
      ? booking.room?.room_number.includes(searchText.value) ||
        booking.user?.name.includes(searchText.value) ||
        booking.user?.email.includes(searchText.value) ||
        booking.order_id.toString().includes(searchText.value) ||
        booking.order?.customer_info.name.includes(searchText.value) ||
        booking.order?.customer_info.email.includes(searchText.value) ||
        booking.order?.customer_info.phone_number.includes(searchText.value)
      : true;
    const matchesStatus = selectedStatus.value ? booking.status == selectedStatus.value : true;
    const matchesCheckInFilter = checkInFilter.value === 'today'
      ? dayjs(booking.check_in_date).isSame(dayjs(), 'day')
      : true;
    return matchesSearchText && matchesStatus && matchesCheckInFilter;
  });
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
    title: 'Tên phòng',
    dataIndex: 'room',
    key: 'room'
  },
  {
    title: 'Ngày nhận phòng',
    dataIndex: 'check_in_date',
    key: 'check_in_date'
  },
  {
    title: 'Ngày trả phòng',
    dataIndex: 'check_out_date',
    key: 'check_out_date'
  },
  {
    title: 'Thành tiền',
    dataIndex: 'total_price',
    key: 'total_price'
  },
  {
    title: 'Số tiền đã thanh toán',
    dataIndex: 'paid_amount',
    key: 'paid_amount'
  },
  {
    title: 'Trạng thái nhận phòng',
    dataIndex: 'status',
    key: 'status'
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return 'blue';
    case 2:
      return 'orange';
    case 3:
      return 'green';
    case 4:
      return 'red';
    case 5:
      return 'gray';
    default:
      return 'default';
  }
};
</script>

<style scoped>
.booking-table-container {
  padding: 20px;
  background-color: #f9f9f9;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  flex: 1;
}

.filter-select {
  width: 200px;
}

.booking-table {
height: 100%;
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