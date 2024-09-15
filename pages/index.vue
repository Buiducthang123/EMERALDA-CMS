<template>
    <NuxtLayout>
        <div class="p-4 w-full">
          <NuxtPage/>
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