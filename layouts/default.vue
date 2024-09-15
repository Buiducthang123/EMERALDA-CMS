<template>
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div class="text-lg">Hotel Management Dashboard</div>
            <div class="flex items-center">
                <span class="mr-2">Admin</span>
                <div class="w-8 h-8 rounded-full overflow-hidden">
                    <NuxtImg src="https://placehold.co/600x400" class="w-full h-full object-cover" />
                </div>
            </div>
        </header>
        <div class="flex flex-1">
            <!-- Sidebar -->
            <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline"
                theme="dark" :inline-collapsed="state.collapsed" :items="items" class="w-64 p-4">
            </a-menu>

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
import { useRoute, useRouter } from 'vue-router';
import {
    PieChartOutlined,
    HomeOutlined,
    UserOutlined,
    BookOutlined,
    CheckCircleOutlined,
    ProfileOutlined,
    AppstoreOutlined,
    CommentOutlined,
    StarOutlined,
    SettingOutlined,
    ToolOutlined,
} from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();

const state = reactive({
    collapsed: false,
    selectedKeys: [route.path],
    openKeys: [],
});

const items = reactive([
    {
        key: '/',
        icon: () => h(PieChartOutlined),
        label: 'Thống kê',
        title: 'statistic',
        path: '/',
        onClick() {
            router.push('/');
        },
    },
    {
        key: '/guest',
        icon: () => h(UserOutlined),
        label: 'Khách hàng',
        title: 'guest',
        onClick() {
            router.push('/guest');
        },
    },
    {
        key: '/rooms',
        icon: () => h(HomeOutlined),
        label: 'Phòng',
        title: 'room',
        onClick() {
            router.push('/rooms');
        },
    },
    {
        key: 'sub1',
        icon: () => h(BookOutlined),
        label: 'Đặt phòng',
        title: 'booking',
        children: [
            {
                key: '/booking/new',
                icon: () => h(AppstoreOutlined),
                label: 'Phòng mới đặt',
                title: 'new-booking',
                onClick() {
                    router.push('/booking/new');
                },
            },
            {
                key: '/booking/confirm-payment',
                icon: () => h(CheckCircleOutlined),
                label: 'Xác nhận thanh toán',
                title: 'confirm-payment',
                onClick() {
                    router.push('/booking/confirm-payment');
                },
            },
            {
                key: '/booking/profile',
                icon: () => h(ProfileOutlined),
                label: 'Hồ sơ đặt phòng',
                title: 'booking-profile',
                onClick() {
                    router.push('/booking/profile');
                },
            },
        ],
    },
    {
        key: '/feature',
        icon: () => h(AppstoreOutlined),
        label: 'Đặc tính phòng',
        title: 'room-feature',
        onClick() {
            router.push('/feature');
        },
    },
    {
        key: '/amenity',
        icon: () => h(ToolOutlined),
        label: 'Tiện nghi',
        title: 'amenity',
        onClick() {
            router.push('/amenity');
        },
    },
    {
        key: '/feedback',
        icon: () => h(CommentOutlined),
        label: 'Phản hồi',
        title: 'feedback',
        onClick() {
            router.push('/feedback');
        },
    },
    {
        key: '/rating',
        icon: () => h(StarOutlined),
        label: 'Đánh giá',
        title: 'rating',
        onClick() {
            router.push('/rating');
        },
    },
    {
        key: '/facility',
        icon: () => h(ToolOutlined),
        label: 'Cơ sở vật chất và trang thiết bị',
        title: 'facility',
        onClick() {
            router.push('/facility');
        },
    },
    {
        key: '/setting',
        icon: () => h(SettingOutlined),
        label: 'Thiết lập',
        title: 'setting',
        onClick() {
            router.push('/setting');
        },
    },
]);

watch(
    () => route.path,
    (newPath) => {
        state.selectedKeys = [newPath];
    }
);

const handleClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    router.push(e.key);
};
</script>