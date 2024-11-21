<template>
    <Loading v-if="!statusResponse" />
    <div v-else class="admin-dashboard p-6 bg-gray-100 min-h-screen">
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
            <div class="info-box bg-white p-4 rounded-lg shadow-md">
                <h2 class="text-lg font-semibold mb-2">Tổng doanh thu</h2>
                <p class="text-2xl font-bold">{{ formatCurrency(statusResponse?.totalRevenue) }}</p>
            </div>
        </div>
        <div class="mb-8 flex items-center gap-4">
            <a-select v-model:value="selectedYear" @change="handleYearChange" class="w-48">
                <a-select-option v-for="year in lastFiveYears" :key="year" :value="year">{{ year }}</a-select-option>
            </a-select>
            <a-select v-model:value="selectedMonth" @change="handleMonthChange" class="w-48">
                <a-select-option v-for="month in months" :key="month.value" :value="month.value">{{ month.label
                    }}</a-select-option>
            </a-select>

            <div>
                <a-button type="primary" @click="handleDownloadCSV">Xuất csv doanh thu</a-button>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="chart-container bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Tỷ lệ phòng theo trạng thái</h2>
                <Pie :data="statusResponse?.statusData" :options="chartOptions" class="max-h-[300px]" />
            </div>
            <div class="chart-container bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Số lượng đặt phòng</h2>
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
import { ref, computed, onMounted } from 'vue';
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
import 'dayjs/locale/vi';
import localeData from 'dayjs/plugin/localeData';
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

dayjs.locale('vi');
dayjs.extend(localeData);

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
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                callback: function (value) {
                    return Number.isInteger(value) ? value : null;
                }
            }
        }
    }
});

const authStore = useAuthStore();
const token = computed(() => authStore.accessToken);

//selected range
const currentYear = dayjs().year();
const lastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = [
    { value: 'all', label: 'Tất cả các tháng' },
    ...Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: dayjs().month(i).format('MMMM')
    }))
];

const selectedYear = ref<any>(currentYear);
const selectedMonth = ref<any>('all');

const rangeTimeSelected = ref<{
    start: string | null,
    end: string | null
}>(getRange(selectedYear.value, selectedMonth.value));

function getRange(year: number, month: string | number) {
    if (month === 'all') {
        const start = dayjs().year(year).startOf('year').format('DD/MM/YYYY');
        const end = dayjs().year(year).endOf('year').format('DD/MM/YYYY');
        return { start, end };
    } else {
        const start = dayjs().year(year).month(Number(month) - 1).startOf('month').format('DD/MM/YYYY');
        const end = dayjs().year(year).month(Number(month) - 1).endOf('month').format('DD/MM/YYYY');
        return { start, end };
    }
}

const handleYearChange: SelectProps['onChange'] = value => {
    selectedYear.value = value;
    rangeTimeSelected.value = getRange(selectedYear.value, selectedMonth.value);
};

const handleMonthChange: SelectProps['onChange'] = value => {
    selectedMonth.value = value;
    rangeTimeSelected.value = getRange(selectedYear.value, selectedMonth.value);
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
        // range: rangeTimeSelected.value
        range: rangeTimeSelected

    },
    watch: [rangeTimeSelected],
});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const handleDownloadCSV = async () => {
    try {
        const range = {
            start: rangeTimeSelected.value.start,
            end: rangeTimeSelected.value.end
        };
        const encodedRange = encodeURIComponent(JSON.stringify(range));

        const response = await fetch(`${useRuntimeConfig().public.baseURL}api/statistical/export?range=${encodedRange}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'statistical_export.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            message.success('Tải về thành công');
        } else {
            message.error('Có lỗi xảy ra');
        }
    } catch (error) {
        console.error("Download CSV error:", error);
        message.error('Có lỗi xảy ra khi tải file');
    }
};


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
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>