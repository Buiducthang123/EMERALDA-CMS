<template>
    <div class="reviews-container p-6 min-h-screen">
        <h1 class="text-2xl font-bold">Quản Lý đánh giá</h1>
        <div v-if="reviews && reviews.length>0" class="space-y-6">
            <a-comment v-for="review in reviews" :key="review.id"
                class="bg-gray-100 p-4 text-base rounded-lg border border-gray-200">
                <template #author>
                    <span class="text-blue-500 cursor-pointer font-semibold text-base">{{ review.user.name }}</span>
                </template>
                <template #avatar>
                    <a-avatar class="w-9 h-9" :src="review.user.avatar || ''" :alt="review.user.name" />
                </template>
                <template #content>
                    <div class="text-gray-700 space-y-2 text-base">
                        <p><strong>Phòng:</strong> {{ review.room_type.name }}</p>
                        <p class="flex items-center space-x-2">
                            <strong>Đánh giá:</strong>
                            <a-rate :value="review.rating" disabled />
                        </p>
                        <p>{{ review.comment }}</p>
                    </div>
                </template>
                <template #datetime>
                    <a-tooltip :title="dayjs(review.created_at).format('YYYY-MM-DD HH:mm:ss')">
                        <span class="text-gray-500 text-base">{{ dayjs(review.created_at).fromNow() }}</span>
                    </a-tooltip>
                </template>
                <a-popconfirm title="Bạn có chắc chắn muốn xóa đánh giá này không?" ok-text="Yes" cancel-text="No"
                    @confirm="deleteReview(review.id)">
                    <a-button danger>Xóa</a-button>
                </a-popconfirm>

            </a-comment>
        </div>

        <div v-else>
            <p class="text-center text-base font-semibold">Hiện tại chưa có đánh giá nào</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime);

const reviews = ref<any[]>([]);
const authStore = useAuthStore();
const token = computed(() => authStore.accessToken);
const fetchReviews = async () => {
    try {
        await $fetch('/api/room-type-reviews', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.value}`,
            },
            baseURL: useRuntimeConfig().public.baseURL,
            params: {
                limit: 10,
                'q[]': ['user', 'roomType'],
            },
            onResponse: ({ response }) => {
                if (response.ok) {
                    reviews.value = response._data;
                }
            },
        });

    } catch (error) {
        console.error('Failed to fetch reviews:', error);
    } finally {

    }
};


onMounted(() => {
    fetchReviews();
});

const deleteReview = async (reviewId: number) => {
    try {
        const config = useRuntimeConfig();
        await $fetch(`/api/room-type-reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.value}`,
            },
            baseURL: config.public.baseURL,
            onResponse: ({ response }) => {
                if (response.ok) {
                    fetchReviews();
                    message.success('Xóa đánh giá thành công');
                }
                else {
                    message.error('Xóa đánh giá thất bại');
                }
            },
        });
    } catch (error) {
        console.error('Failed to delete review:', error);
        message.error('Xóa đánh giá thất bại');
    }
};
</script>

<style scoped>
.reviews-container {
    padding: 20px;
}

.comment-action {
    margin-left: 8px;
}
</style>