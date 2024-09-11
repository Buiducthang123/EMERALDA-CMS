<template>
    <div class="flex gap-4 ">
        <div  v-for="(image, index) in images" :key="index" class="relative">
            <NuxtImg :src="image" class="w-52"/>
            <div class="absolute top-2 right-2 bg-white w-6 h-6 opacity-75 transition-all rounded-full hover:opacity-100">
                <Icon class="" name="i-material-symbols-close-small-outline" :size="24" @click="removeImage(index)"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const images = ref<string[]>([
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
]);

const removeImage = (index: number) => {
    images.value.splice(index, 1);
}
</script>

<style scoped>

</style>