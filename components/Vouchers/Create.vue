<template>
  <a-modal v-model:open="props.open" title="Thêm Voucher" :width="1000" style="top: 20px" @ok="handleOk" @cancel="handleCancel">
    <div class="h-[70vh] overflow-y-scroll">
      <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
        <a-form-item label="Tên Voucher" name="name" :rules="rules.name">
          <a-input v-model:value="form.name" placeholder="Nhập tên voucher" />
        </a-form-item>
        <a-form-item label="Ảnh đại diện" name="main_image">
          <div class="flex gap-6">
            <a-image :width="300" v-if="form.main_image" :src="form.main_image" class="rounded-lg max-h-[180px] object-cover" />
            <a-image :width="300" v-else src="https://placehold.co/300x180" class="rounded-lg" />
            <a-upload :file-list="fileList" accept="image/*" @change="handleImageChange" :max-count="1">
              <a-button :loading="loading" :disabled="loading">Tải ảnh lên</a-button>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="Mô tả" name="description">
          <CkEditor v-model:value="form.description" />
        </a-form-item>
        <a-form-item label="Mã Voucher" name="code" :rules="rules.code">
          <a-input v-model:value="form.code" placeholder="Nhập mã voucher" />
        </a-form-item>
        <a-form-item label="Số tiền giảm giá" name="discount_amount" :rules="rules.discount_amount">
          <a-input-number v-model:value="form.discount_amount" min="0" />
        </a-form-item>
        <a-form-item label="Ngày bắt đầu hiệu lực" name="valid_from" :rules="rules.valid_from">
          <a-date-picker v-model:value="form.valid_from" />
        </a-form-item>
        <a-form-item label="Ngày hết hạn" name="valid_until" :rules="rules.valid_until">
          <a-date-picker v-model:value="form.valid_until" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits, onMounted, computed } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';
import { notification, message } from 'ant-design-vue';
import { type UploadChangeParam, type UploadProps } from 'ant-design-vue';
import { handleUploadImg } from '~/utils/file-upload';
import { useAuthStore } from '~/stores/auth';
import type { Rule } from 'ant-design-vue/es/form';
import dayjs from 'dayjs';
import type { IRoomType } from '~/interfaces/IRoomType';

interface VoucherForm {
  name: string;
  main_image: string;
  description: string;
  code: string;
  discount_amount: number;
  valid_from: dayjs.Dayjs;
  valid_until: dayjs.Dayjs;
}

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['handle-cancel', 'refresh-voucher']);

const formRef = ref();
const form = reactive<VoucherForm>({
  name: '',
  main_image: '',
  description: '',
  code: '',
  discount_amount: 0,
  valid_from: dayjs(),
  valid_until: dayjs(),
});

const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'Vui lòng nhập tên voucher', trigger: 'blur' },
    { max: 255, message: 'Tên voucher không được vượt quá 255 ký tự', trigger: 'blur' },
  ],
  code: [
    { required: true, message: 'Vui lòng nhập mã voucher', trigger: 'blur' },
    { max: 20 , message: 'Mã voucher không được vượt quá 20 ký tự', trigger: 'blur' },
  ],
  discount_amount: [{ required: true, message: 'Vui lòng nhập số tiền giảm giá', trigger: 'blur' }],
  valid_from: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu hiệu lực', trigger: 'blur' }],
  valid_until: [{ required: true, message: 'Vui lòng chọn ngày hết hạn', trigger: 'blur' }],
};

const roomTypes = ref<IRoomType[]>([]);
const loading = ref(false);
const fileList = ref<UploadProps['fileList']>([]);

const handleImageChange = async (info: UploadChangeParam) => {
  form.main_image = await handleUploadImg(info.fileList, loading.value) || '';
};

const authStore = useAuthStore();
const token = computed(() => authStore.accessToken);

const handleOk = async () => {
    await formRef.value.validate();
    const config = useRuntimeConfig();
    const validFromFormatted = dayjs(form.valid_from).format('YYYY-MM-DD');
    const validUntilFormatted = dayjs(form.valid_until).format('YYYY-MM-DD');
    await $fetch('/api/vouchers', {
      method: 'POST',
      baseURL: config.public.baseURL,
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
      body: {
        ...form,
        valid_from: validFromFormatted,
        valid_until: validUntilFormatted,
      },
      onResponse: ({ response }) => {
        if (response.ok) {
          emit('refresh-voucher');
          emit('handle-cancel');
          message.success('Tạo voucher thành công');
        }
        else {
          notification.error({
            message: 'Có lỗi xảy ra',
            description: response._data.message || 'Vui lòng thử lại sau',
          });
        }
      },
    });
   
};

const handleCancel = () => {
  emit('handle-cancel');
};

watch(() => props.open, (newVal) => {
  if (newVal) {
    form.name = '';
    form.main_image = '';
    form.description = '';
    form.code = '';
    form.discount_amount = 0;
    form.valid_from = dayjs();
    form.valid_until = dayjs();
  }
});

</script>

<style scoped>
/* Add your styles here if needed */
</style>