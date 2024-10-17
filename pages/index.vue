<template>
    <NuxtLayout>
        <div class="p-4 w-full">
          <NuxtPage/>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { IUser } from '~/interfaces/IUser';

// definePageMeta({
//   middleware: ["auth"]
// })
const authStore = useAuthStore();
const { setUserInfo, setAccessToken } = authStore;

</script>

<style scoped>

</style>