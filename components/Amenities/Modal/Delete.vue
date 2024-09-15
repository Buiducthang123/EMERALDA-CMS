<template>
    <a-modal v-model:visible="props.visible" title="Xóa tiện ích" @ok="handleDelete" @cancel="handleCancel">
        <p>Bạn có chắc chắn muốn xóa tiện ích này không?</p>
    </a-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { IAmenity } from '~/interfaces/IAmenity';

const props = defineProps<{
    visible: boolean;
    amenity: IAmenity | undefined;
}>();

const emits = defineEmits(['update:visible', 'refreshAmenity']);

const auth = useAuthStore();
const { accessToken } = auth;

const handleDelete = async () => {
    try {
        const result = await $fetch.raw('/api/amenities/' + props.amenity?.id, {
            method: 'DELETE',
            baseURL: useRuntimeConfig().public.baseURL,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${accessToken}`
            }
        });
        if (result.ok) {
            message.success('Xóa thành công');
            emits('update:visible', false);
            emits('refreshAmenity');
            return;
        }
        message.error('Có lỗi xảy ra');
    } catch (err) {
        console.log(err);
        message.error('Có lỗi xảy ra');
    }
};

const handleCancel = () => {
    emits('update:visible', false);
};
</script>