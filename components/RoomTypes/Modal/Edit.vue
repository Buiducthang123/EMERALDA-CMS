<template>
    <a-modal v-model:open="props.open" title="Chỉnh Sửa Loại Phòng" :width="1000" style="top: 20px" @ok="handleOk"
        @cancel="handleCancel">
        <div class="h-[70vh] overflow-y-scroll">
            <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
                <a-form-item label="Tên loại phòng" name="name">
                    <a-input v-model:value="form.name" placeholder="Nhập tên loại phòng" />
                </a-form-item>
                <a-form-item label="Slug" name="slug">
                    <a-input v-model:value="form.slug" placeholder="Nhập slug" />
                </a-form-item>
                <a-form-item label="Mô tả ngắn" name="intro_description">
                    <a-input v-model:value="form.intro_description" placeholder="Nhập mô tả ngắn" />
                </a-form-item>
                <a-form-item label="Mô tả" name="description">
                    <CkEditor v-if="props.open" v-model:value="form.description"/>
                </a-form-item>
                <div class="flex gap-10">
                    <a-form-item label="Giá" name="price">
                        <a-input-number v-model:value="form.price" min="0" />
                    </a-form-item>
                    <a-form-item label="Số người tối đa" name="max_people">
                        <a-input-number v-model:value="form.max_people" min="1" />
                    </a-form-item>
                    <a-form-item label="Diện tích" name="area">
                        <a-input-number v-model:value="form.area" min="0" />
                        <span> m<sup>2</sup></span>
                    </a-form-item>
                </div>
                <a-form-item label="Tiện nghi" name="amenities">
                    <a-checkbox-group v-model:value="form.amenities">
                        <a-checkbox v-for="(amenity, index) in amenities" :key="index" :value="amenity.id">{{
                            amenity.name
                            }}</a-checkbox>
                    </a-checkbox-group>
                </a-form-item>
                <a-form-item label="Ảnh đại diện" name="main_image">
                    <div class="flex gap-6">
                        <a-image :width="300" v-if="form.main_image" :src="form.main_image"
                            class="rounded-lg max-h-[180px] object-cover" />
                        <a-image :width="300" v-else src="https://placehold.co/300x180" class="rounded-lg" />
                        <a-upload :file-list="fileList" accept="image/*" @change="handleChange" :max-count="1">
                            <a-button :loading="loading" :disabled="loading">
                                Tải ảnh lên
                            </a-button>
                        </a-upload>
                    </div>
                </a-form-item>
                <a-form-item label="Ảnh mô tả thêm" name="thumbnails">
                    <Slider v-model:value="form.thumbnails" :edit="true" />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';
import { notification } from 'ant-design-vue';
import { type UploadChangeParam, type UploadProps } from 'ant-design-vue';
import { handleUploadImg } from '~/utils/file-upload';
import type { Rule } from 'ant-design-vue/es/form';
import type { IFeature } from '~/interfaces/IFeature';
import type { IAmenity } from '~/interfaces/IAmenity';
import type { IRoomType } from '~/interfaces/IRoomType';

interface RoomTypeForm {
    name: string;
    main_image: string;
    slug: string;
    description: string;
    price: number;
    intro_description: string;
    max_people: number;
    amenities: string[];
    area: number;
    thumbnails: string[];
}

const props = defineProps<{
    open: boolean;
    roomType: IRoomType | null;
}>();

const emit = defineEmits<{
    (e: 'handle-cancel'): void;
    (e: 'refresh-room-type'): void;
}>();

const formRef = ref();
const form = reactive<RoomTypeForm>({
    name: '',
    main_image: 'https://placehold.co/300x180',
    slug: '',
    description: '',
    intro_description: '',
    price: 0,
    max_people: 3,
    amenities: [],
    area: 0,
    thumbnails: [],
});

const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: 'Vui lòng nhập tên loại phòng', trigger: 'blur' }],
    slug: [
        { required: true, message: 'Vui lòng nhập slug', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9-]+$/, message: 'Slug chỉ được chứa chữ cái, số và dấu -', trigger: 'blur' }
    ],
    intro_description: [{ required: true, message: 'Vui lòng nhập mô tả ngắn', trigger: 'blur' }],
    description: [{ required: true, message: 'Vui lòng nhập mô tả', trigger: 'blur' }],
    price: [
        { required: true, message: 'Vui lòng nhập giá', trigger: 'blur' },
        { type: 'number', min: 1, message: 'Giá phải lớn hơn 0', trigger: 'blur' }
    ],
    max_people: [{ required: true, message: 'Vui lòng nhập số người tối đa', trigger: 'blur' }],
    area: [
        { required: true, message: 'Vui lòng nhập diện tích', trigger: 'blur' },
        { type: 'number', min: 1, message: 'Diện tích phải lớn hơn 0', trigger: 'blur' }
    ],
};

watch(() => props.open, (newVal) => {
    if (newVal && props.roomType) {
        Object.assign(form, props.roomType);
    }
});

const { data: amenities } = await useFetch<IAmenity[]>('/api/amenities', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const loading = ref(false);
const fileList = ref<UploadProps['fileList']>([]);

const handleChange = async (info: UploadChangeParam) => {
    form.main_image = await handleUploadImg(info.fileList, loading.value) || '';
};

const handleOk = async () => {
    try {
        await formRef.value.validate();
        const config = useRuntimeConfig();
        await useFetch(`/api/room-types/${props.roomType?.id}`, {
            method: 'PATCH',
            baseURL: config.public.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            body: form,
        });
        notification.success({
            message: 'Cập nhật loại phòng thành công',
        });
        emit('refresh-room-type');
        emit('handle-cancel');
    } catch (error) {
        notification.error({
            message: 'Có lỗi xảy ra',
        });
    }
};

const handleCancel = () => {
    emit('handle-cancel');
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>