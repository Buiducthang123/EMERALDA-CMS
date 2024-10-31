<template>
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div class="text-lg">Hotel Management Dashboard</div>
            <a-dropdown v-if="user" class="ml-4">
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="setting" @click="handleMenuClick('setting')">
                            <SettingOutlined /> Thiết lập
                        </a-menu-item>
                        <a-menu-item key="logout" @click="handleMenuClick('logout')">
                            <LogoutOutlined /> Đăng xuất
                        </a-menu-item>
                    </a-menu>
                </template>
                <div class="flex items-center">
                    <span class="mr-2">{{ user?.name }}</span>
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <NuxtImg :src="user?.avatar || 'https://placehold.co/600x400'"
                            class="w-full h-full object-cover" />
                    </div>

                </div>
            </a-dropdown>

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
import { reactive, watch, h, computed, onMounted } from 'vue';
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
    ApartmentOutlined,
    LogoutOutlined,
    GiftOutlined, // Importing the LogoutOutlined icon
} from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
import type { IUser } from '~/interfaces/IUser';
import { useAuthStore } from '~/stores/auth';
import { useCookie } from '#app';
import { useFetch } from '#app';
import { useRuntimeConfig } from '#app';
import { notification } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();

const state = reactive({
    collapsed: false,
    selectedKeys: [route.path],
    openKeys: [],
});

const authStore = useAuthStore();
const { setUserInfo, setAccessToken, logout } = authStore;

const user = computed(() => authStore.user);

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
        key: '/room_type',
        icon: () => h(ApartmentOutlined),
        label: 'Loại phòng',
        title: 'room_type',
        onClick() {
            router.push('/room_type');
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
                    router.push('/bookings');
                },
            },
            {
                key: '/booking/payment',
                icon: () => h(CheckCircleOutlined),
                label: 'Thanh toán',
                title: 'confirm-payment',
                onClick() {
                    router.push('/bookings/payment');
                },
            },
            {
                key: '/booking/cancel-request',
                icon: () => h(ProfileOutlined),
                label: 'Yêu cầu hủy phòng',
                title: 'cancel-request',
                onClick() {
                    router.push('/bookings/cancel-request');
                },
            },
        ],
    },
    // {
    //     key: '/feature',
    //     icon: () => h(AppstoreOutlined),
    //     label: 'Đặc tính phòng',
    //     title: 'room-feature',
    //     onClick() {
    //         router.push('/feature');
    //     },
    // },
    {
        key: '/amenity',
        icon: () => h(ToolOutlined),
        label: 'Tiện nghi',
        title: 'amenity',
        onClick() {
            router.push('/amenity');
        },
    },
    // {
    //     key: '/feedback',
    //     icon: () => h(CommentOutlined),
    //     label: 'Phản hồi',
    //     title: 'feedback',
    //     onClick() {
    //         router.push('/feedback');
    //     },
    // },
    {
        key: '/reviews',
        icon: () => h(StarOutlined),
        label: 'Đánh giá',
        title: 'review',
        onClick() {
            router.push('/reviews');
        },
    },
    // {
    //     key: '/facility',
    //     icon: () => h(ToolOutlined),
    //     label: 'Cơ sở vật chất và trang thiết bị',
    //     title: 'facility',
    //     onClick() {
    //         router.push('/facility');
    //     },
    // },
    // {
    //     key: '/setting',
    //     icon: () => h(SettingOutlined),
    //     label: 'Thiết lập',
    //     title: 'setting',
    //     onClick() {
    //         router.push('/setting');
    //     },
    // },
    {
        key: '/voucher',
        icon: () => h(GiftOutlined),
        label: 'Voucher',
        title: 'voucher',
        onClick() {
            router.push('/voucher');
        },
    }
]);

watch(
    () => route.path,
    (newPath) => {
        state.selectedKeys = [newPath];
    }
);

const handleMenuClick = (key: string) => {
    if (key === 'setting') {
        router.push('/setting');
    } else if (key === 'logout') {
        logout();
        router.push('/login');
    }
};

</script>