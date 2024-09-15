<template>
    <div>
        <h1 class="text-2xl font-bold">Quản lý tiện ích phòng</h1>
        <div class="text-end my-4">
            <a-button type="primary" @click="showCreateModal">Thêm mới</a-button>
        </div>
        <a-table
            :columns="columns"
            :data-source="amenityData??[]"
            :pagination="pagination"
            bordered
            class="w-full"
            childrenColumnName="mx-auto"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                    <b>{{ record.name }}</b>
                </template>

                <template v-if="column.dataIndex === 'status'">
                    <div v-if="text === 'active'">
                        <a-tag color="green">Active</a-tag>
                    </div>
                    <div v-else>
                        <a-tag color="red">Inactive</a-tag>
                    </div>
                </template>

                <template v-if="column.dataIndex === 'actions'">
                    <div class="flex gap-3">
                        <a-button type="primary" @click="editAmenity(record)">Sửa</a-button>
                        <a-button danger @click="confirmDelete(record)">Xóa</a-button>
                    </div>
                </template>
            </template>

            <template #title>
                <div class="flex justify-between">
                    <h1 class="text-xl font-bold">Amenity Management</h1>
                    <a-input-search style="width: 200px" placeholder="Search" />
                </div>
            </template>
        </a-table>

        <!-- Edit Modal -->
        <AmenitiesModalEdit :visible="isModalVisible" :amenity="selectedAmenity" @update:visible="isModalVisible = $event"  @refresh-amenity="refreshAmenity" />
        
        <!--Create Modal-->
        <AmenitiesModalCreate :visible="isCreateModalVisible" @update:visible="isCreateModalVisible = $event" @refresh-amenity="refreshAmenity" />
        
        <!-- Delete Modal -->
        <AmenitiesModalDelete :visible="isDeleteModalVisible" :amenity="selectedAmenity" @update:visible="isDeleteModalVisible = $event" @refresh-amenity="refreshAmenity" />
    </div>
</template>

<script lang="ts" setup>
import type { IAmenity } from '~/interfaces/IAmenity';

const columns = [
    {
        title: 'Tên tiện ích',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Hành động',
        dataIndex: 'actions',
    },
];

const { data: amenityData, refresh: refreshAmenity } = await useFetch<IAmenity[]>('/api/amenities', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
});

const isCreateModalVisible = ref(false);
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const selectedAmenity = ref<IAmenity>();

const pagination = ref({
    current: 1,
    pageSize: 10,
    total: amenityData.value?.length || 0,
});

const showCreateModal = () => {
    isCreateModalVisible.value = true;
};

const showModal = () => {
    isModalVisible.value = true;
};

const editAmenity = (record: any) => {
    selectedAmenity.value = { ...record };
    isModalVisible.value = true;
};

const confirmDelete = (record: any) => {
    selectedAmenity.value = { ...record };
    isDeleteModalVisible.value = true;
};

</script>

<style scoped>
th.column-money,
td.column-money {
    text-align: right !important;
}
</style>