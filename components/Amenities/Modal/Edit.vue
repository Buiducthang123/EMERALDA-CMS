<template>
    <a-modal v-model:visible="props.visible" title="Edit Amenity" @ok="handleOk" @cancel="handleCancel">
        <a-form :form="form" layout="vertical">
            <a-form-item label="Tên tiện ích" name="name">
                <a-input v-model:value="formData.name" />
            </a-form-item>
            <a-form-item label="Mô tả" name="description">
                <CkEditor v-model:value="formData.description" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import type { IAmenity } from '~/interfaces/IAmenity';

const auth = useAuthStore();
const { accessToken } = auth;

const props = defineProps<{
  visible: boolean;
  amenity: IAmenity | undefined;
}>();

const emits = defineEmits(['update:visible', 'submit', 'refreshAmenity']);

const form = ref(null);
const formData = ref({
    name: '',
    description: ''
});

watch(() => props.amenity, (newAmenity) => {
    formData.value = {
        name: newAmenity?.name || '',
        description: newAmenity?.description || ''
    };
});

const handleOk = async () => {
    try {
        const result = await $fetch.raw('/api/amenities/' + props.amenity?.id, {
            method: 'PATCH',
            baseURL: useRuntimeConfig().public.baseURL,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData.value)
        });
        if (result.ok) {
            message.success('Cập nhật thành công');
            emits('update:visible', false);
            resetForm();
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

const resetForm = () => {
    formData.value = {
        name: '',
        description: ''
    };
};
</script>