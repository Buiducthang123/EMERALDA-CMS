<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">Quản Lý Loại Phòng</h1>
            <a-button type="primary" @click="openModalCreate = true">Thêm Loại Phòng</a-button>
        </div>

        <a-table :columns="columns" :data-source="roomTypeData || []" bordered class="w-full"
            childrenColumnName="mx-auto" :pagination="false">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'main_image'">
                    <a-image :width="100" :src="record.main_image" alt="main_image" class="h-20 object-cover" />
                </template>
                <template v-if="column.dataIndex === 'name'">
                    <span>{{ record.name }}</span>
                </template>

                <template v-if="column.dataIndex === 'price'">
                    <span>{{ record.price }} VND</span>
                </template>

                <template v-if="column.dataIndex === 'area'">
                    <span>{{ record.area }} m<sup>2</sup></span>
                </template>

                <template v-if="column.dataIndex === 'actions'">
                    <div class="space-x-2 w-fit">
                        <a-button type="ghost" class="bg-green-500 text-white">xem</a-button>
                        <a-button type="primary"
                            @click="() => { roomTypeSelected = record; openModalUpdate = true; }">Sửa</a-button>
                        <a-button danger @click="() => { openModalDelete = true; roomTypeSelected = record }">Xóa</a-button>
                    </div>
                </template>
            </template>

            <template #title>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <h1 class="text-base font-bold">Thông tin loại phòng</h1>
                        <a-tooltip>
                            <template #title>làm mới</template>
                            <span class="inline-block h-5 cursor-pointer" @click="handleResetFilter()">
                                <Icon name="i-ri-refresh-line" size="20px" />
                            </span>
                        </a-tooltip>
                    </div>
                    <div class="flex space-x-2">
                        <a-input-search v-model:value="filter.name" placeholder="Tìm kiếm loại phòng" enter-button
                            class="w-60" />
                    </div>
                </div>
            </template>
        </a-table>
        <RoomTypesModalEdit v-show="openModalUpdate" :room-type="roomTypeSelected || undefined" :open="openModalUpdate"
            @handle-cancel="openModalUpdate = false" @refresh-room-type="refreshRoomType" />

        <RoomTypesModalCreate :open="openModalCreate" @handle-cancel="openModalCreate = false"
            @refresh-room-type="refreshRoomType" />

        <room-type-modal-delete :room-type="roomTypeSelected" :open="openModalDelete"
            @handle-cancel="openModalDelete = false" @refresh-room-type="refreshRoomType" />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '#imports';
import type { IRoomType } from '~/interfaces/IRoomType';

const openModalUpdate = ref(false);
const openModalCreate = ref(false);
const openModalDelete = ref(false);
const authStore = useAuthStore();
const selectedRoomType = ref<IRoomType | null>(null);
const { accessToken } = authStore;
const columns = ref([
    {
        title:'Ảnh đại diện',
        dataIndex: 'main_image',
        key: 'main_image',
    },
    {
        title: 'Tên loại phòng',
        dataIndex: 'name', key: 'name'
    },
    {
        title: 'Tổng số phòng',
        dataIndex: 'total_rooms',
        key: 'total_rooms',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title:'Diện tích',
        dataIndex: 'area',
        key: 'area',
    },
    {
        title: 'Hành Động',
        key: 'actions',
        dataIndex: 'actions',
    },
]);

const filter = reactive({
    name: '',
    page: 1,
});

const { data: roomTypeData, refresh: refreshRoomType } = await useFetch<IRoomType[]>('api/room-types', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    },
    query: filter,
});

const roomTypeSelected = ref<IRoomType | any>();

const handleResetFilter = () => {
    filter.name = '';
}

</script>

<style scoped>
/* Thêm style nếu cần */
</style>