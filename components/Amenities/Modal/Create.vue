<template>
    <a-modal v-model:open="props.visible" title="Tạo tiện ích mới" @ok="handleCreate" @cancel="handleCancel">
        <a-form :form="formData" layout="vertical">
            <a-form-item label="Tên tiện ích" name="name" >
                <a-input v-model:value="formData.name" />
            </a-form-item>
            <a-form-item label="Mô tả" name="description">
                <CkEditor v-model:value="formData.description" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
    visible: boolean;
}>();

const emits = defineEmits(['update:visible', 'refreshAmenity']);

const auth = useAuthStore();
const { accessToken } = auth;

const formData = ref({
    name: '',
    description: ''
});

const handleCreate = async () => {
    try {
        const result = await $fetch.raw('/api/amenities', {
            method: 'POST',
            baseURL: useRuntimeConfig().public.baseURL,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData.value)
        });
        if (result.ok) {
            message.success('Tạo thành công');
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