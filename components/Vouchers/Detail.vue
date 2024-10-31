<template>
  <a-modal v-model:open="props.open" title="Chi tiết Voucher" :width="1000" style="top: 20px" @cancel="handleCancel" footer={null}>
    <div class="h-[70vh] overflow-y-scroll" v-if="props.voucher">
      <div class="detail-item">
        <strong>Tên Voucher:</strong>
        <p>{{ props.voucher.name }}</p>
      </div>
      <div class="detail-item">
        <strong>Ảnh đại diện:</strong>
        <a-image :width="300" :src="props.voucher.main_image || 'https://placehold.co/300x180'" class="rounded-lg max-h-[180px] object-cover" />
      </div>
      <div class="detail-item">
        <strong>Mô tả:</strong>
        <div v-html="props.voucher.description"></div>
      </div>
      <div class="detail-item">
        <strong>Mã Voucher:</strong>
        <p>{{ props.voucher.code }}</p>
      </div>
      <div class="detail-item">
        <strong>Số tiền giảm giá:</strong>
        <p>{{ props.voucher.discount_amount }}</p>
      </div>
      <div class="detail-item">
        <strong>Ngày bắt đầu hiệu lực:</strong>
        <p>{{ props.voucher.valid_from }}</p>
      </div>
      <div class="detail-item">
        <strong>Ngày hết hạn:</strong>
        <p>{{ props.voucher.valid_until }}</p>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, watch } from 'vue';
import type { IVoucher } from '~/interfaces/IVoucher';

const props = defineProps<{
  open: boolean;
  voucher: IVoucher|undefined;
}>();

const emit = defineEmits(['handle-cancel']);

const handleCancel = () => {
  emit('handle-cancel');
};
</script>

<style>

</style>