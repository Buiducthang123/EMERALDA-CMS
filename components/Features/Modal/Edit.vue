<template>
    <a-modal v-model:visible="props.visible" title="Edit Feature" @ok="handleOk" @cancel="handleCancel" >
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
import type { IFeature } from '~/interfaces/IFeature';

const auth = useAuthStore();
const { accessToken } = auth;

const props = defineProps<{
  visible: boolean;
  feature: IFeature|undefined;
}>();

const emits = defineEmits(['update:visible', 'submit', 'refreshFeature']);

const form = ref(null);
interface IFormFeature{
    name: string;
    description: string;
}
const formData = ref<IFormFeature>({
    name: '',
    description:''
});

watch(() => props.feature, (newFeature) => {
    formData.value = {
        name: newFeature?.name || '',
        description: newFeature?.description || ''
    };
});

const handleOk = async() => {
   try{
        const result = await $fetch.raw('/api/features/'+props.feature?.id, {
            method: 'PATCH',
            baseURL: useRuntimeConfig().public.baseURL,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData.value)
        });
        if(result.ok){
            message.success('Cập nhật thành công');
            emits('update:visible', false);
            resetForm();
            emits('refreshFeature');
            return;
        }
        message.error('Có lỗi xảy ra');
   }
    catch(err){
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