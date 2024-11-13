<template>
  <div class="mb-4" v-if="edit && images.length >= 2">
    <span>Chỉnh sửa vị trí </span>
    <a-switch v-model:checked="isChangeImageIndex" size="small" />
  </div>

  <div class="pb-4 flex gap-4 overflow-x-scroll" v-if="!isChangeImageIndex">
    <div v-for="(item, index) in images" :key="index" class="">
      <a-image :src="item" width="200px" height="176px" class="object-cover">
        <template #previewMask>
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 gap-6">
            <span class="hover:text-blue-500 transition-all">Xem</span>
            <span class="hover:text-blue-500 transition-all" @click="()=>{
              images.splice(index,1)
              emit('update:modelValue', images)
            }">Xóa</span>
          </div>
        </template>
      </a-image>
    </div>
  </div>

  <div class="pb-4 flex gap-4 overflow-x-scroll cursor-move" v-else>
    <draggable name="abc" item-key="element" v-model="images" tag="transition-group" @change="emit('update:modelValue', images)">
      <template #item="{ element, index }">
        <img :key="index" :src="element" class="w-[200px] h-44 object-cover" />
      </template>
    </draggable>
  </div>

  <a-upload :file-list="fileList" accept="image/*" @change="handleChange" :max-count="1" class="text-wrap">
    <a-button :loading="loading" :disabled="loading">
      <div class="flex items-center gap-1">
        <Icon name="i-material-symbols-add" />
        Thêm ảnh
      </div>
    </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { handleUploadImg } from '~/utils/file-upload';

const props = defineProps<{
  modelValue: string[];
  edit: boolean;
}>();

const images = ref([...props.modelValue]);

const emit = defineEmits(['update:modelValue','handleUpdateThumbnail']);

const isChangeImageIndex = ref(false);

// File upload
const fileList = ref<UploadProps['fileList']>([]);
const loading = ref<boolean>(false);

const handleChange = async (info: UploadChangeParam) => {
  try {
    const newImages = await handleUploadImg(info.fileList);
    images.value = [...images.value, newImages]; 
    emit('update:modelValue', images.value);
  }catch (e) {
    message.error('Có lỗi xảy ra');
  }
};


</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #888 #f1f1f1; /* Firefox */
}

.custom-scrollbar::-webkit-scrollbar {
  height: 3px; /* Height of horizontal scrollbar */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; /* Background of the scrollbar track */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #888; /* Color of the scrollbar thumb */
  border-radius: 10px; /* Roundness of the scrollbar thumb */
  border: 2px solid #f1f1f1; /* Padding around the scrollbar thumb */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555; /* Color of the scrollbar thumb when hovered */
}
</style>