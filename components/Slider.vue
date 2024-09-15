<template>

  <div class="mb-4" v-if="edit && images.length>=2">
    <span>Chỉnh sửa vị trí </span><a-switch v-model:checked="isChangeImageIndex" size="small" />
  </div>

  <a-carousel :slidesToShow="3" arrows :dots="false" :infinite="false" class="mb-6 mx-0" v-if="!isChangeImageIndex">
    <template #prevArrow>
      <div class="custom-slick-arrow" style="left: 20px; z-index: 1">
        <left-circle-outlined />
      </div>
    </template>
    <template #nextArrow>
      <div class="custom-slick-arrow" style="right: 20px">
        <right-circle-outlined />
      </div>
    </template>
    <div v-for="(item, index) in images" :key="index">
      <a-image :src="item" class="">
        <template #previewMask>
          <div class="absolute inset-0 gap-6  flex items-center justify-center bg-black bg-opacity-50">
            <span class="hover:text-blue-500 transition-all">Xem</span>
            <span class="hover:text-blue-500 transition-all">Sửa</span>
            <span class="hover:text-blue-500 transition-all">Xóa</span>
          </div>
        </template>
      </a-image>
    </div>
  </a-carousel>

  <div class="custom-scrollbar pb-4 flex gap-4 overflow-x-scroll cursor-move" v-else>
    <draggable name="abc" item-key="element" v-model="images" tag="transition-group"
      @change="emit('update:value',images)">
      <template #item="{ element, index }" class="flex">
        <img :key="index" :src="element" class="w-[30%] object-cover" />
      </template>
    </draggable>
  </div>

  <a-upload :file-list="fileList" accept="image/*" @change="handleChange" :max-count="1" class="text-wrap">
    <a-button :loading="loading" :disabled="loading">
     <div class="flex items-center gap-1" size="24px">
      <Icon name="i-material-symbols-add"/>
      Thêm ảnh
     </div>
    </a-button>
  </a-upload>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import draggable from 'vuedraggable';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { handleUploadImg } from '~/utils/file-upload';

const props = defineProps<{
  value: string[];
  edit:boolean
}>();

const images = ref(props.value);

const emit = defineEmits(['update:value']);

const isChangeImageIndex = ref(false);


//file
const fileList = ref([]);
const loading = ref<boolean>(false);

const handleChange = async(info: UploadChangeParam) => {
    try{
      const newImages = await handleUploadImg(info.fileList);
      images.value = [...images.value, newImages];
      console.log('images', images.value);
      
    }
    catch(e){
      message.error('Có lỗi xảy ra');
    }
};
</script>

<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 150px;
  min-height: 150px;
  overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

:deep(.slick-slide h3) {
  color: #fff;
}

:deep(.slick-track) {
  display: flex;
  width: 100%;

  overflow: hidden;
  object-fit: cover;
}

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

/* file */
/* .avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
} */
</style>