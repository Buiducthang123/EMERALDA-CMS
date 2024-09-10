<template>
    <a-modal v-model:open="open" title="Chỉnh Sửa Phòng" @ok="handleOk" @cancel="handleCancel" :width="800">
        <a-form :model="form" layout="vertical">
            <a-form-item required>
                <template #label>
                    <span class="mr-2 font-bold">Tên Phòng</span>
                </template>
                <a-input v-model:value="form.room_number" size='large' />
            </a-form-item>
            <div class="flex gap-6 ">
                <a-form-item class="w-full" required>
                    <template #label>
                        <span class="mr-2 font-bold">Loại Phòng</span>
                    </template>
                    <a-select v-model:value="form.room_type" size="large">
                        <a-select-option value="">Chọn loại phòng</a-select-option>
                        <a-select-option v-for="(type, index) in roomType" :key="type.id" :value="type.id">{{ type.name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item class="w-full" required>
                    <template #label>
                        <span class="mr-2 font-bold">Trạng thái</span>
                    </template>
                    <a-select v-model:value="form.status" size="large">
                        <a-select-option value="">Chọn trạng thái</a-select-option>
                        <a-select-option :value="ERoomStatus.AVAILABLE">{{ RoomStatusText[ERoomStatus.AVAILABLE] }}</a-select-option>
                        <a-select-option :value="ERoomStatus.BOOKED">{{ RoomStatusText[ERoomStatus.BOOKED] }}</a-select-option>
                        <a-select-option :value="ERoomStatus.MAINTENANCE">{{ RoomStatusText[ERoomStatus.AVAILABLE] }}</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="flex gap-10">
                <a-form-item required>
                    <template #label>
                        <span class="mr-2 font-bold">Giá</span>
                    </template>
                    <a-input-number v-model:value="form.price" min="0" />
                </a-form-item>
                <a-form-item required>
                    <template #label>
                        <span class="mr-2 font-bold">Người lớn</span>
                    </template>
                    <a-input-number v-model:value="form.price" min="0" />
                </a-form-item>
                <a-form-item required>
                    <template #label>
                        <span class="mr-2 font-bold">Trẻ em</span>
                    </template>
                    <a-input-number v-model:value="form.price" min="0" />
                </a-form-item>
                <a-form-item required>
                    <template #label>
                        <span class="mr-2 font-bold">Diện tích</span>
                    </template>
                    <a-input-number v-model:value="form.price" min="0" />
                    <span> m<sup>2</sup></span>
                </a-form-item>
            </div>
            <div>
                <a-form-item required>
                    <template #label>
                        <span class="mr-2 font-bold">Tiện nghi</span>
                    </template>
                    <a-checkbox-group v-model="form.facilities">
                        <a-checkbox v-for="(facility, index) in facilities" :key="index" :value="facility">{{ facility }}</a-checkbox>
                    </a-checkbox-group>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ERoomStatus, RoomStatusText } from '~/enums/ERoomStatus';
import type { IRoom } from '~/interfaces/IRoom';
import type { IRoomType } from '~/interfaces/IRoomType';

const props = defineProps<{
  room: IRoom | undefined;
  open: boolean;
  roomType:IRoomType[] | null;
}>();

const open = ref(props.open);
const emit = defineEmits(['update:open', 'save']);

const form = ref({
  room_number: '',
  room_type: '',
  status: '',
  price: 0,
  facilities: [],
});

watch(
  () => props.room,
  (newRoom) => {
    if (newRoom) {
      form.value = { ...newRoom };
    }
  },
  { immediate: true }
);

const handleOk = () => {
  emit('save', form.value);
  emit('update:open', false);
};

const handleCancel = () => {
  emit('update:open', false);
};
</script>

<style scoped>
/* Thêm style nếu cần */
</style>