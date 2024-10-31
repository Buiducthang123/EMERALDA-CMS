<template>
  <a-modal v-model:open="props.open" title="Sửa Voucher" :width="1000" style="top: 20px" @ok="handleOk" @cancel="handleCancel">
    <div class="h-[70vh] overflow-y-scroll">
      <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
        <a-form-item label="Tên Voucher" name="name" :rules="[{ required: true, message: 'Vui lòng nhập tên voucher!' }]">
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
            <CkEditor v-model="form.description" />
        </a-form-item>
        <a-form-item label="Mã Voucher" name="code" :rules="[{ required: true, message: 'Vui lòng nhập mã voucher!' }]">
          <a-input v-model:value="form.code" placeholder="Nhập mã voucher" />
        </a-form-item>
        <a-form-item label="Số tiền giảm giá" name="discount_amount" :rules="[{ required: true, message: 'Vui lòng nhập số tiền giảm giá!' }]">
          <a-input-number v-model:value="form.discount_amount" min="0" />
        </a-form-item>
        <a-form-item label="Ngày bắt đầu hiệu lực" name="valid_from" :rules="[{ required: true, message: 'Vui lòng chọn ngày bắt đầu hiệu lực!' }]">
          <a-date-picker v-model:value="form.valid_from"/>
        </a-form-item>
        <a-form-item label="Ngày hết hạn" name="valid_until" :rules="[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]">
          <a-date-picker v-model:value="form.valid_until" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits, onMounted, watch } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';
import { notification } from 'ant-design-vue';
import { type UploadChangeParam, type UploadProps } from 'ant-design-vue';
import { handleUploadImg } from '~/utils/file-upload';
import type { Rule } from 'ant-design-vue/es/form';
import type { IVoucher } from '~/interfaces/IVoucher';
import dayjs from 'dayjs';


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
  voucher: IVoucher | undefined;
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
  name: [{ required: true, message: 'Vui lòng nhập tên voucher', trigger: 'blur' }],
  code: [{ required: true, message: 'Vui lòng nhập mã voucher', trigger: 'blur' }],
  discount_amount: [{ required: true, message: 'Vui lòng nhập số tiền giảm giá', trigger: 'blur' }],
  valid_from: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu hiệu lực', trigger: 'blur' }],
  valid_until: [{ required: true, message: 'Vui lòng chọn ngày hết hạn', trigger: 'blur' }],
};

const loading = ref(false);
const fileList = ref<UploadProps['fileList']>([]);

const handleImageChange = async (info: UploadChangeParam) => {
  form.main_image = await handleUploadImg(info.fileList, loading.value) || '';
};
const authStore = useAuthStore();
const token = computed(() => authStore.accessToken);
const handleOk = async () => {
  try {
    await formRef.value.validate();
    const config = useRuntimeConfig();
    await useFetch(`/api/vouchers/${props.voucher?.id}`, {
      method: 'PATCH',
      baseURL: config.public.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      body: form,
      onResponse:({response})=>{
       if(response.ok){
          notification.success({
            message: 'Cập nhật voucher thành công',
          });
          emit('handle-cancel');
          emit('refresh-voucher');
       }
       else{
          notification.error({
            message: 'Cập nhật voucher thất bại',
          });
       }
      }
    });
  } catch (error) {
    notification.error({
      message: 'Có lỗi xảy ra',
    });
  }
};

const handleCancel = () => {
  emit('handle-cancel');
};

onMounted(() => {
  if (props.voucher) {
    form.name = props.voucher.name;
    form.main_image = props.voucher?.main_image || '';
    form.description = props.voucher?.description || '';
    form.code = props.voucher.code;
    form.discount_amount = props.voucher.discount_amount;
    form.valid_from = dayjs(props.voucher.valid_from)|| dayjs();
    form.valid_until = dayjs(props.voucher.valid_until) || dayjs();
  }
});
</script>

<style>
/* Add your styles here if needed */
:deep(.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline) {
  min-height: 300px !important;
 padding: 40px !important;
}
</style>