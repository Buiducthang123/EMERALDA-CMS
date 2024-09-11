<template>
  <div>
    <h1>Upload Image</h1>
    <input type="file" @change="onFileChange" />
    <button @click="uploadImage">Upload</button>

    <NuxtImg src="https://i.ibb.co/87v429x/jack-la-ai-doi-thu-cua-son-tung-m-tp-nghi-an-ban-sao-ngo-diec-pham-1628386961-3.jpg"/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const selectedFile = ref<File | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    alert('Please select a file first.');
    return;
  }

  const formData = new FormData();
  formData.append('image', selectedFile.value);

  try {
    const response = await fetch('https://api.imgbb.com/1/upload?key=14cc7136f05a039beb83d8183385e78b', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log('Image uploaded successfully:', data);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
</script>