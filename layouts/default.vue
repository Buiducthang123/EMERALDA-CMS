<template>
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div class="text-lg">Hotel Management Dashboard</div>
            <div class="flex items-center">
                <span class="mr-2">Admin</span>
                <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
            </div>
        </header>
        <div class="flex flex-1">
            <!-- Sidebar -->
            <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline"
                theme="dark" :inline-collapsed="state.collapsed" :items="items" class="w-64"></a-menu>


            <!-- Main Content -->
            <main class="flex flex-1">
                <slot />
            </main>
        </div>
        <footer class="bg-gray-900 text-white p-4 text-center">
            Hotel Management Dashboard ©2024 Created by You
        </footer>

    </div>
</template>
<script lang="ts" setup>
import { reactive, watch, h } from 'vue';
import {
    PieChartOutlined,
    DesktopOutlined,
    InboxOutlined,
    MailOutlined,
    AppstoreOutlined,
    CommentOutlined,
    StarOutlined,
    HomeOutlined,
    SettingOutlined,
    ToolOutlined,
} from '@ant-design/icons-vue';
const state = reactive({
    collapsed: false,
    selectedKeys: ['1'],
    openKeys: ['sub1'],
    preOpenKeys: ['sub1'],
});
const items = reactive([
    {
        key: '1',
        icon: () => h(PieChartOutlined),
        label: 'Thống kê',
        title: 'statistic',
    },
    {
        key: 'sub1',
        icon: () => h(MailOutlined),
        label: 'Đặt phòng',
        title: 'booking',
        children: [
            {
                key: 'sub1-chill-1',
                label: 'Phòng mới đặt',
                title: 'new-booking',
            },
            {
                key: 'sub1-chill-2',
                label: 'Xác nhận thanh toán',
                title: 'confirm-payment',
            },
            {
                key: 'sub1-chill-3',
                label: 'Hồ sơ đặt phòng',
                title: 'booking-profile',
            },
        ],
    },
    {
        key: '4',
        icon: () => h(CommentOutlined),
        label: 'Phản hồi',
        title: 'feedback',
    },
    {
        key: '5',
        icon: () => h(StarOutlined),
        label: 'Đánh giá',
        title: 'rating',
    },
    {
        key: '6',
        icon: () => h(HomeOutlined),
        label: 'Phòng',
        title: 'room',
    },
    {
        key: '7',
        icon: () => h(ToolOutlined),
        label: 'Cơ sở vật chất và trang thiết bị',
        title: 'facility',
    },
    {
        key: '8',
        icon: () => h(SettingOutlined),
        label: 'Thiết lập',
        title: 'setting',
    },
]);
watch(
    () => state.openKeys,
    (_val, oldVal) => {
        state.preOpenKeys = oldVal;
    },
);
const toggleCollapsed = () => {
    state.collapsed = !state.collapsed;
    state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>