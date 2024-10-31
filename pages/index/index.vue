<template>
    <Loading v-if="!statusResponse" />
    <div  v-else class="admin-dashboard p-6 bg-gray-100 min-h-screen">
        <h1 class="text-3xl font-bold mb-6">Thống kê</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="info-box bg-white p-4 rounded-lg shadow-md">
                <h2 class="text-lg font-semibold mb-2">Tổng số người dùng</h2>
                <p class="text-2xl font-bold">{{ statusResponse?.totalUser }}</p>
            </div>
            <div class="info-box bg-white p-4 rounded-lg shadow-md">
                <h2 class="text-lg font-semibold mb-2">Tổng số phòng</h2>
                <p class="text-2xl font-bold">{{ statusResponse?.totalRoom }}</p>
            </div>
        </div>
        <div class="mb-8 flex items-center gap-4">
            <a-select v-model:value="selectedRange" @change="handleChange" class="w-48">
                <a-select-option value="all">Từ trước tới nay</a-select-option>
                <a-select-option v-for="year in lastFiveYears" :key="year" :value="year">{{ year }}</a-select-option>
            </a-select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="chart-container bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Tỷ lệ phòng theo trạng thái</h2>
                <Pie :data="statusResponse?.statusData" :options="chartOptions" class="max-h-[300px]" />
            </div>
            <div class="chart-container bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Số lượng đặt phòng theo tháng</h2>
                <Bar :data="statusResponse?.bookingBar" :options="chartOptions" class="max-h-[300px]" />
            </div>
            <div class="chart-container bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Doanh thu theo loại phòng</h2>
                <Bar :data="statusResponse?.revenue_by_room_type" :options="chartOptions" class="max-h-[300px]" />
            </div>
            <div class="chart-container bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Xu hướng doanh thu theo thời gian</h2>
                <Line :data="statusResponse?.revenueTrend" :options="chartOptions" class="max-h-[300px]" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Pie, Bar, Line } from 'vue-chartjs';
import dayjs from 'dayjs';
import type { SelectProps } from 'ant-design-vue';
// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: 'Chart.js Chart'
        }
    }
});

const authStore = useAuthStore();
const token = computed(() => authStore.accessToken);

//selected range
const currentYear = dayjs().year();
const lastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

const selectedRange = ref('all');
const rangeTimeSelected = ref<{
    start: string | null,
    end: string | null
}>({
    start: '08/03/2002',
    end: dayjs().format('DD/MM/YYYY')
});
const handleChange: SelectProps['onChange'] = value => {
    if (value === 'all') {
    rangeTimeSelected.value.start = '08/03/2002';
    rangeTimeSelected.value.end = dayjs().format('DD/MM/YYYY');
  } else {
    rangeTimeSelected.value.start = dayjs().year(Number(value)).startOf('year').format('DD/MM/YYYY');
    rangeTimeSelected.value.end = dayjs().year(Number(value)).endOf('year').format('DD/MM/YYYY');
  }
};

//fetch data
const { data: statusResponse, refresh } = useFetch<any>('/api/statistical', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.value}`
    },
    baseURL: useRuntimeConfig().public.baseURL,
    query: {
        range: rangeTimeSelected.value
    },
    watch: [selectedRange],
});

onMounted(() => {
    refresh();
});
</script>

<style scoped>
.admin-dashboard {
    padding: 20px;
}


.chart-container {
    width: 100%;
    height: 400px;
    /* background-color: #fff; */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>