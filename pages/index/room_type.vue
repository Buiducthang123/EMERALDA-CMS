<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">Quản Lý Loại Phòng</h1>
            <a-button type="primary" @click="openModalCreate = true">Thêm Loại Phòng</a-button>
        </div>

        <a-table :columns="columns" :data-source="roomTypeDataFiltered || []" bordered class="w-full"
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
                    <a-select v-model:value="filter.name" placeholder="Chọn loại phòng" class="w-60">
                        <a-select-option :value="undefined">
                        Tất cả
                        </a-select-option>
                        <a-select-option v-for="item in roomTypeData" :key="item.name" :value="item.name">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
            </div>
                </div>
            </template>
        </a-table>
        <LazyRoomTypesModalEdit v-if="openModalUpdate" :room-type="roomTypeSelected || undefined" :open="openModalUpdate"
            @handle-cancel="openModalUpdate = false" @refresh-room-type="refreshRoomType" />

        <LazyRoomTypesModalCreate v-if="openModalCreate" :open="openModalCreate" @handle-cancel="openModalCreate = false"
            @refresh-room-type="refreshRoomType" />

        <RoomTypesModalDelete v-if="openModalDelete" :room-type="roomTypeSelected" :room-type-id="roomTypeSelected?.id" :open="openModalDelete"
            @handleCancel="openModalDelete = false" @refreshRoomTypes="refreshRoomType" />
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
const accessToken = computed(() => authStore.accessToken);
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
    name: undefined,
});

const { data: roomTypeData, refresh: refreshRoomType } = await useFetch<IRoomType[]>('api/room-types', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`
    },
    query: filter,
});

const roomTypeSelected = ref<IRoomType | any>();

const handleResetFilter = () => {
    refreshRoomType();
    filter.name = undefined;
}

const roomTypeDataFiltered = computed(() => {
    if (!filter.name) return roomTypeData.value;
    if ( roomTypeData.value && roomTypeData.value.length>0) {
        console.log(roomTypeData.value);
        
        return roomTypeData.value.filter((item) => item.name == filter.name);
    }
    return [];
});

</script>

<style scoped>
/* Thêm style nếu cần */
</style>