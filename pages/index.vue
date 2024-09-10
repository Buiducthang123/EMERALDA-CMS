<template>
    <NuxtLayout>
        <div class="w-full">
            {{ user}}
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})
const authStore = useAuthStore();
const { user } = authStore;
</script>

<style scoped>

</style>