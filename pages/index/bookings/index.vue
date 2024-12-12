<template>
  <div class="booking-table-container">
    <h6 class="mb-8 text-xl font-semibold">Danh sách đặt phòng</h6>
    <div class="filters">
      <a-input v-model:value="searchText" placeholder="Tìm kiếm theo mã đơn, tên phòng, người dùng..."
        class="filter-input" />
      <a-select v-model:value="selectedStatus" placeholder="Lọc theo trạng thái" class="filter-select" allowClear>
        <a-select-option v-for="(label, value) in EBookingStatusText" :key="value" :value="value">
          {{ label }}
        </a-select-option>
      </a-select>
      <a-select v-model:value="checkInFilter" placeholder="Lọc theo ngày nhận phòng" class="filter-select" allowClear>
        <a-select-option value="all">Hiển thị tất cả</a-select-option>
        <a-select-option value="today">Có thể nhận phòng hôm nay</a-select-option>
      </a-select>
    </div>
    <a-table :columns="columns" :dataSource="filteredBookings" :expandedRowKeys="expandedRowKeys" @expand="onExpand"
      rowKey="id" class="booking-table">
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
        <template v-if="column.key === 'action'">
          <a-button @click="toggleExpand(record as IBooking)">Cài đặt</a-button>
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
            <p><strong>Thành tiền:</strong> <span class="font-medium text-green-500">{{ formatPrice(record.total_price)
                }}</span></p>
            <p><strong>Số tiền đã thanh toán: </strong><span class="font-medium text-green-500">
                {{ formatPrice(record.paid_amount) }}
              </span></p>
            <p><strong>Trạng thái:</strong> {{ EBookingStatusText[record.status as keyof typeof EBookingStatusText] }}
            </p>
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
          <div class="w-full">
            <h6 class="section-title">Cập nhật trạng thái</h6>
            <a-steps :current="currentStep" :items="statusSteps"></a-steps>
            <div class="steps-content">
              <span v-if="currentStep != EBookingStatus.CHECKED_IN">{{ steps[currentStep].content }}</span>
              <template v-if="currentStep === EBookingStatus.CHECKED_IN || currentStep === EBookingStatus.CHECKED_OUT">
                <div>
                  <h6 class="text-center my-6 text-xl font-semibold">Tạo hóa đơn dịch vụ</h6>
                  <div class="flex justify-between">
                    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd(record)">Thêm dịch
                      vụ</a-button>
                    <a-button v-if="currentStep === EBookingStatus.CHECKED_IN" class="editable-add-btn" type="primary"
                      style="margin-bottom: 8px" @click="handleCreateInvoice(record)">Lưu hóa đơn</a-button>
                    <a-popconfirm
                      v-if="currentStep === EBookingStatus.CHECKED_OUT && record?.invoice?.status != EInvoiceStatus.PAID"
                      title="Xác nhận rằng khách hàng đã thanh toán đủ ?" @confirm="handleUpdateInvoiceStatus(record)">
                      <a-button class="editable-add-btn" type="primary" style="margin-bottom: 8px">Xác nhận thanh toán
                        đủ</a-button>
                    </a-popconfirm>
                  </div>
                  <a-table bordered :data-source="record?.invoice?.services" :columns="columnsInvoice"
                    :pagination="false">
                    <template #bodyCell="{ column, text, record: recordService }">
                      <template v-if="column.dataIndex === 'name'">
                        <div class="editable-cell">
                          <div v-if="editableData[recordService.key]" class="editable-cell-input-wrapper">
                            <a-input v-model:value="editableData[recordService.key].name"
                              @pressEnter="save(recordService.key, recordService)" />
                            <check-outlined class="editable-cell-icon-check"
                              @click="save(recordService.key, recordService)" />
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <edit-outlined class="editable-cell-icon" @click="edit(recordService.key, recordService)" />
                          </div>
                        </div>
                      </template>
                      <template v-if="column.dataIndex === 'quantity'">
                        <div class="editable-cell flex">
                          <div v-if="editableData[recordService.key]" class="editable-cell-input-wrapper">
                            <a-input v-model:value="editableData[recordService.key].quantity"
                              @pressEnter="save(recordService.key, recordService)" />
                            <check-outlined class="editable-cell-icon-check"
                              @click="save(recordService.key, recordService)" />
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <edit-outlined class="editable-cell-icon" @click="edit(recordService.key, recordService)" />
                          </div>
                        </div>
                      </template>
                      <template v-if="column.dataIndex === 'price'">
                        <div class="editable-cell flex">
                          <div v-if="editableData[recordService.key]" class="editable-cell-input-wrapper">
                            <a-input v-model:value="editableData[recordService.key].price"
                              @pressEnter="save(recordService.key, recordService)" />
                            <check-outlined class="editable-cell-icon-check"
                              @click="save(recordService.key, recordService)" />
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text }}
                            <edit-outlined class="editable-cell-icon" @click="edit(recordService.key, recordService)" />
                          </div>
                        </div>
                      </template>
                      <template v-if="column.dataIndex === 'note'">
                        <div class="editable-cell">
                          <div v-if="editableData[recordService.key]" class="editable-cell-input-wrapper">
                            <a-textarea v-model:value="editableData[recordService.key].note" class="w-full" />
                            <check-outlined class="editable-cell-icon-check" />
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <edit-outlined class="editable-cell-icon" />
                          </div>
                        </div>
                      </template>
                      <template v-else-if="column.dataIndex === 'operation'">
                        <a-popconfirm title="Bạn có chắc chắn muốn xóa" @confirm="onDelete(record, recordService.key)">
                          <a>Xóa</a>
                        </a-popconfirm>
                      </template>
                    </template>
                  </a-table>
                  <div class="flex items-center justify-around">
                    <div class="mt-4 mb-6 flex gap-2 text-base items-center font-medium">
                      <span class=" text-green-500">Tiền dịch vụ: </span>
                      <span>{{ formatPrice(
                        record?.invoice?.services?.reduce(
                          (total: number, item: any) => total + (Number(item?.price) || 0) * (Number(item?.quantity) ||
                        0),
                        0
                        ) || 0
                        ) }}</span>
                    </div>

                    <div class="mt-4 mb-6 flex gap-2 text-base items-center font-medium">
                      <span class=" text-green-500">Tiền phòng: </span>
                      {{ formatPrice(record.total_price) }}
                    </div>

                    <div class="mt-4 mb-6 flex gap-2 text-base items-center font-medium">
                      <span class=" text-green-500">Đã trả: </span>
                      <span>{{ formatPrice(record.paid_amount) }}</span>
                    </div>
                  </div>
                  <hr>
                  <div class="text-center py-4">
                    <a-tag v-if="record?.invoice?.status == EInvoiceStatus.PAID" color="green">ĐÃ THANH TOÁN</a-tag>
                    <a-tag v-else color="red">CHƯA THANH TOÁN</a-tag>
                  </div>
                  <div class="flex gap-2 justify-center pb-8 text-base font-medium ">
                    <span> Tổng số tiền phải trả: </span>
                    <span class="text-green-500">
                      {{ formatPrice(
                        (
                          (record?.invoice?.services?.reduce(
                            (total, item) => total + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
                            0
                          ) || 0) +
                          (Number(record?.total_price) || 0) -
                          (Number(record?.paid_amount) || 0)
                        )
                      ) }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <div class="steps-action flex justify-between ">
              <div>
                <a-button v-if="currentStep < steps.length - 1" type="primary" @click="nextStep(record)">Tiếp
                  tục</a-button>
                <a-button v-if="currentStep > 0" style="margin-left: 8px" @click="prevStep">Quay lại</a-button>
              </div>

              <a-button type="primary" @click="confirmUpdateStatus(record)">
                Lưu trạng thái
              </a-button>
            </div>
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
import type { IBooking } from '~/interfaces/IBooking';
import dayjs from '#build/dayjs.imports.mjs';
import { EBookingStatus, EBookingStatusText } from '~/enums/EBookingStatus';
import { notification } from 'ant-design-vue';
import type { Ref, UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash-es';
import { EInvoiceStatus } from '~/enums/EInvoiceStatus';

const authStore = useAuthStore();
const { setUserInfo, setAccessToken } = authStore;

const access_token = computed(() => authStore.accessToken);

const { data: bookings, refresh: refreshBookings } = await useFetch<IBooking[]>('api/bookings', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    Authorization: `Bearer ${access_token.value}`
  },
  query: {
    'p[]': ['room', 'user', 'order', 'invoice'],
    'latest': true
  }
});

const searchText = ref('');
const selectedStatus = ref<number>();
const checkInFilter = ref<string>('all');
const expandedRowKeys = ref<number[]>([]);
const isModalVisible = ref(false);

const currentStep = ref<number>(0);
const steps = [
  {
    title: EBookingStatusText[EBookingStatus.CANCELLED],
    content: EBookingStatusText[EBookingStatus.CANCELLED],
    value: EBookingStatus.CANCELLED
  },
  {
    title: EBookingStatusText[EBookingStatus.PENDING_APPROVAL],
    content: EBookingStatusText[EBookingStatus.PENDING_APPROVAL],
    value: EBookingStatus.PENDING_APPROVAL
  },
  {
    title: EBookingStatusText[EBookingStatus.WAITING_CHECK_IN],
    content: EBookingStatusText[EBookingStatus.WAITING_CHECK_IN],
    value: EBookingStatus.WAITING_CHECK_IN
  },
  {
    title: EBookingStatusText[EBookingStatus.CHECKED_IN],
    content: EBookingStatusText[EBookingStatus.CHECKED_IN],
    value: EBookingStatus.CHECKED_IN
  },
  {
    title: EBookingStatusText[EBookingStatus.CHECKED_OUT],
    content: EBookingStatusText[EBookingStatus.CHECKED_OUT],
    value: EBookingStatus.CHECKED_OUT
  },

];
const statusSteps = steps.map(step => ({ key: step.title, title: step.title }));

const nextStep = (record: any) => {
  if (currentStep.value === EBookingStatus.CHECKED_IN) {
    if (!record?.invoice) {
      message.error('Vui lòng thêm dịch vụ vào hóa đơn');
      return;
    }
  };
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};

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
  {
    title: 'Hành động',
    key: 'action',
    dataIndex: 'action'
  }
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

const toggleExpand = async (record: IBooking) => {
  if (expandedRowKeys.value.includes(record.id)) {
    expandedRowKeys.value = expandedRowKeys.value.filter(key => key !== record.id);

  } else {
    expandedRowKeys.value.push(record.id);
    currentStep.value = steps.findIndex(step => step.value === record.status);
  }
};

const onExpand = (expanded: boolean, record: IBooking) => {
  if (expanded) {
    expandedRowKeys.value.push(record.id);
    currentStep.value = steps.findIndex(step => step.value === record.status);
  } else {
    expandedRowKeys.value = expandedRowKeys.value.filter(key => key !== record.id);
  }
};

const confirmUpdateStatus = async (record: any) => {
  if (currentStep.value == EBookingStatus.CHECKED_IN) {
    if (!record?.invoice) {
      notification.error({
        message: 'Vui lòng thêm dịch vụ vào hóa đơn',
      });
      return;
    }
  }
  if (currentStep.value == EBookingStatus.CHECKED_OUT) {
    if (record?.invoice?.status != EInvoiceStatus.PAID) {
      notification.error({
        message: 'Vui lòng xác nhận khách hàng đã thanh toán đủ',
      });
      return;
    }
  }
  try {
    await useFetch(`/api/bookings/update-status/${record.id}`, {
      method: 'POST',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: `Bearer ${access_token.value}`,
        'Content-Type': 'application/json',
      },
      body: {
        status: steps[currentStep.value].value,
      },
    });
    notification.success({
      message: 'Cập nhật trạng thái thành công',
    });
    refreshBookings();
  } catch (error: any) {
    notification.error({
      message: 'Cập nhật trạng thái thất bại',
      description: error.message,
    });
  } finally {
    isModalVisible.value = false;
  }
};


// invoice

interface invoiceData {
  key: string;
  name: string;
  quantity: number;
  price: number;
  note: string;
}

const columnsInvoice = [
  {
    title: 'Tên dịch vụ',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
  },
  {
    title: 'Đơn giá',
    dataIndex: 'price',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
  },
  {
    title: 'operation',
    dataIndex: 'operation',
  },
];

const editableData: UnwrapRef<Record<string, invoiceData>> = reactive({});

const edit = (key: string, data: any) => {
  editableData[key] = data;
};
const save = (key: string, data: any) => {
  console.log(data);
  delete editableData[key]
};
const onDelete = (record: any, key: string) => {

  bookings.value?.forEach((booking) => {
    if (booking.id === record.id) {
      booking.invoice.services = booking.invoice.services.filter((item: any) => item.key !== key);
    }
  })

};
const handleAdd = (record: any) => {
  let count = record?.invoice?.services.length ?? 0;
  const newData = {
    key: `${count}`,
    name: `Tên dịch vụ`,
    quantity: 1,
    price: 0,
    note: `Không có ghi chú`,
  };
  // invoiceData.value.push(newData);
  if (bookings.value) {
    bookings.value.forEach((booking) => {
      if (booking.id === record.id) {
        if (!booking.invoice) {
          booking.invoice = {
            services: []
          }
        }
        booking.invoice.services.push(newData);
      }
    })
  };
};

//form
interface InvoiceForm {
  booking_id: number | undefined;
  services: invoiceData[] | [];
  service_price: number;
}
const invoiceForm = ref({
  booking_id: undefined,
  services: [],
  service_price: 0,
} as InvoiceForm);

const handleCreateInvoice = async (record: any) => {
  invoiceForm.value.booking_id = record.id;
  invoiceForm.value.services = record?.invoice?.services || [];
  invoiceForm.value.service_price =
    (
      (record?.invoice?.services?.reduce(
        (total, item) => total + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
        0
      ) || 0)
    );
  try {
    await useFetch(`/api/invoices`, {
      method: 'POST',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: `Bearer ${access_token.value}`,
        'Content-Type': 'application/json',
      },
      body: invoiceForm.value,
      onResponse: ({ response }) => {
        if (response.ok) {
          notification.success({
            message: 'Tạo hóa đơn thành công',
          });
          refreshBookings();
        }
        else {
          notification.error({
            message: 'Tạo hóa đơn thất bại',
            description: response.statusText,
          });
        }
      }
    });

  } catch (error: any) {
    notification.error({
      message: 'Tạo hóa đơn thất bại',
      description: error.message,
    });
  }
}
//update status invoice

const handleUpdateInvoiceStatus = async (record: any) => {
  try {
    await useFetch(`api/invoices/update-status`, {
      method: 'POST',
      baseURL: useRuntimeConfig().public.baseURL,
      headers: {
        Authorization: `Bearer ${access_token.value}`,
        'Content-Type': 'application/json',
      },
      body: {
        booking_id: record.id,
        status: EInvoiceStatus.PAID,
      },
    });
    notification.success({
      message: 'Cập nhật trạng thái hóa đơn thành công',
    });
    refreshBookings();
  } catch (error: any) {
    notification.error({
      message: 'Cập nhật trạng thái hóa đơn thất bại',
      description: error.message,
    });
  }
}

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

.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;

}

.steps-action {
  margin-top: 24px;
}

[data-theme='dark'] .steps-content {
  background-color: #2f2f2f;
  border: 1px dashed #404040;
}

.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>