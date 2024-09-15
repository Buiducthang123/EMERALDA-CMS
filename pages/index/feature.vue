<template>
    <div>
        <h1 class="text-2xl font-bold">Quản lý đặc tính phòng</h1>
        <div class="text-end my-4">
            <a-button type="primary" @click="showModal">Thêm mới</a-button>
        </div>
        <a-table
            :columns="columns"
            :data-source="featureData??[]"
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
                        <a-button type="primary" @click="editFeature(record)">Sửa</a-button>
                        <a-button danger @click="confirmDelete(record)">Xóa</a-button>
                    </div>
                </template>
            </template>

            <template #title>
                <div class="flex justify-between">
                    <h1 class="text-xl font-bold">Feature Management</h1>
                    <a-input-search style="width: 200px" placeholder="Search" />
                </div>
            </template>
        </a-table>

        <!-- Edit Modal -->
        <FeaturesModalEdit :visible="isModalVisible" :feature="selectedFeature" @update:visible="isModalVisible = $event" @submit="handleSubmit" @refresh-feature="refreshFeature" />

        <!-- Delete Modal -->
        <FeaturesModalDelete :visible="isDeleteModalVisible" :feature="selectedFeature" @update:visible="isDeleteModalVisible = $event" @refresh-feature="refreshFeature" />

        <FeaturesModalCreate :visible="isModalVisible" @update:visible="isModalVisible = $event" @refresh-feature="refreshFeature" />
    </div>
</template>

<script lang="ts" setup>
import type { IFeature } from '~/interfaces/IFeature';

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

const { data: featureData, refresh: refreshFeature } = await useFetch<IFeature[]>('/api/features', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
});

const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const selectedFeature = ref<IFeature>();

const pagination = ref({
    current: 1,
    pageSize: 10,
    total: featureData.value?.length || 0,
});

const showModal = () => {
    isModalVisible.value = true;
};

const editFeature = (record: any) => {
    selectedFeature.value = { ...record };
    isModalVisible.value = true;
};

const confirmDelete = (record: any) => {
    selectedFeature.value = { ...record };
    isDeleteModalVisible.value = true;
};

const handleSubmit = (updatedFeature: IFeature) => {
    console.log('Updated feature:', updatedFeature);
    // Handle the update logic here
};

</script>

<style scoped>
th.column-money,
td.column-money {
    text-align: right !important;
}
</style>