<template>
    <div class="cancel-request-table-container">
        <h6 class="mb-8 text-xl font-semibold">Danh sách yêu cầu hủy</h6>
        <div class="filters">
            <a-input v-model:value="filters.order_id" placeholder="Lọc theo mã đơn đặt phòng" class="filter-input" />
            <a-input v-model:value="filters.user_id" placeholder="Lọc theo mã người dùng" class="filter-input" />
            <a-select v-model:value="filters.status" placeholder="Lọc theo trạng thái" class="filter-select" allowClear>
                <a-select-option :value="undefined">Tất cả trạng thái</a-select-option>
                <a-select-option :value="0">Chờ xác nhận</a-select-option>
                <a-select-option :value="1">Đã xác nhận</a-select-option>
                <a-select-option :value="2">Đã hủy</a-select-option>
            </a-select>
            <a-button type="primary" @click="handleSearch">Tìm kiếm</a-button>
        </div>
        <a-table :columns="columns" :dataSource="cancelRequests || []" rowKey="id" :expandedRowKeys="expandedRowKeys"
            @expand="onExpand" class="cancel-request-table">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'refund_amount'">
                    {{ formatPrice(record.refund_amount) }}
                </template>
                <template v-if="column.key === 'created_at'">
                    {{ dayjs(record.created_at).format('DD/MM/YYYY') }}
                </template>
                <template v-if="column.key === 'status'">
                    <a-tag :color="getStatusColor(record.status)">
                        {{ ECancelRequestStatusLabel[record.status as ECancelRequestStatus] }}
                    </a-tag>
                </template>
                <template v-if="column.key === 'action'">
                    <a-button @click="toggleExpand(record.id)">Cài đặt</a-button>
                </template>
            </template>
            <template #expandedRowRender="{ record }">
                <div class="expanded-row">
                    <div class="expanded-row-section">
                        <h6 class="section-title">Thông tin yêu cầu hủy</h6>
                        <p><strong>Mã đơn đặt phòng:</strong> {{ record.order_id }}</p>
                        <p><strong>Mã người dùng:</strong> {{ record.user_id }}</p>
                        <p><strong>Mã phòng:</strong> {{ record.room_id }}</p>
                        <p><strong>Số tiền hoàn lại:</strong> {{ formatPrice(record.refund_amount) }}</p>
                        <p><strong>Ngày tạo:</strong> {{ dayjs(record.created_at).format('DD/MM/YYYY') }}</p>
                        <p><strong>Trạng thái:</strong> {{ ECancelRequestStatusLabel[record.status as
                            ECancelRequestStatus] }}</p>
                    </div>
                    <div class="expanded-row-section">
                        <h6 class="section-title">Thông tin tài khoản ngân hàng</h6>
                        <p><strong>Số tài khoản:</strong> {{ record.bank_account_info.bankAccountNumber }}</p>
                        <p><strong>Tên người nhận:</strong> {{ record.bank_account_info.recipientName }}</p>
                        <p><strong>Tên ngân hàng:</strong> {{ record.bank_account_info.bankName }}</p>
                    </div>

                    <div class="expanded-row-section">
                        <h6 class="section-title">Cập nhật trạng thái</h6>
                        <div class="flex flex-col gap-6">
                            <a-select v-model:value="statusSelectUpdate" placeholder="Cập nhật trạng thái" class="w-full">
                                <a-select-option :value="ECancelRequestStatus.PENDING">{{ECancelRequestStatusLabel[ECancelRequestStatus.PENDING]}}</a-select-option>
                                <a-select-option :value="ECancelRequestStatus.WAITING_COMPLETE">{{ECancelRequestStatusLabel[ECancelRequestStatus.WAITING_COMPLETE]}}</a-select-option>
                                <a-select-option :value="ECancelRequestStatus.COMPLETED">{{ECancelRequestStatusLabel[ECancelRequestStatus.COMPLETED]}}</a-select-option>
                                <a-select-option :value="ECancelRequestStatus.REJECTED">{{ECancelRequestStatusLabel[ECancelRequestStatus.REJECTED]}}</a-select-option>
                                <a-select-option :value="ECancelRequestStatus.CANCELED">{{ECancelRequestStatusLabel[ECancelRequestStatus.CANCELED]}}</a-select-option>
                            </a-select>

                            <a-button type="primary" @click="updateStatus(record.id)" class="w-24">Lưu lại</a-button>
                        </div>

                    </div>
                </div>
                <div v-if="record.status == ECancelRequestStatus.WAITING_COMPLETE">
                    Tạo hóa đơn hoàn tiền ...
                    //chưa code xong ...
                </div>  
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';
import dayjs from '#build/dayjs.imports.mjs';
import type { ICancelRequest } from '~/interfaces/ICancelRequest';
import type { IBooking } from '~/interfaces/IBooking';
import { ECancelRequestStatus, ECancelRequestStatusLabel } from '~/enums/ECancelRequestStatus';

const statusSelectUpdate = ref<ECancelRequestStatus | undefined>(undefined);

const filters = ref({
    order_id: undefined,
    user_id: '',
    status: ''
});

const access_token = computed(() => useAuthStore().accessToken);

const query = reactive({
    'filter[order_id]': filters.value.order_id,
    'filter[user_id]': filters.value.user_id,
    'filter[status]': filters.value.status
});

const { data:cancelRequests, refresh:refreshData } = await useFetch<ICancelRequest[]>('api/cancel-request', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURL,
    query: query,
    headers: {
        Authorization: `Bearer ${access_token.value}`
    },
    watch: [query]
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
        title: 'Số tiền hoàn lại',
        dataIndex: 'refund_amount',
        key: 'refund_amount'
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        key: 'created_at'
    },
    {
        title: 'Trạng thái',
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
        case 0:
            return 'blue';
        case 1:
            return 'green';
        case 2:
            return 'red';
        default:
            return 'default';
    }
};

const expandedRowKeys = ref<number[]>([]);

const toggleExpand = (id: number) => {
    if (expandedRowKeys.value.includes(id)) {
        expandedRowKeys.value = expandedRowKeys.value.filter(key => key !== id);
    } else {
        expandedRowKeys.value.push(id);
    }
};

const onExpand = (expanded: boolean, record: IBooking) => {
    if (expanded) {
        expandedRowKeys.value.push(record.id);
    } else {
        expandedRowKeys.value = expandedRowKeys.value.filter(key => key !== record.id);
    }
};

const handleSearch = async () => {
    query['filter[order_id]'] = filters.value.order_id;
    query['filter[user_id]'] = filters.value.user_id;
    query['filter[status]'] = filters.value.status;
};

const updateStatus = async (id: number) => {
    if (statusSelectUpdate.value !== undefined) {
        await useFetch(`api/cancel-request/update-status/${id}`, {
            method: 'POST',
            baseURL: useRuntimeConfig().public.baseURL,
            body: {
                status: statusSelectUpdate.value
            },
            headers: {
                Authorization: `Bearer ${access_token.value}`
            },
            onResponse: ({response}) => {
               if (response.status === 200) {
                  refreshData();
                  message.success('Cập nhật trạng thái thành công');
               }
               else {
                  message.error('Cập nhật trạng thái thất bại');
               }
            }
        });
    }
};

</script>

<style scoped>
.cancel-request-table-container {
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

.cancel-request-table {
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