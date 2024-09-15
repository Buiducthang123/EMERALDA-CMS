<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <a-card class="w-full max-w-md">
      <h2 class="text-center text-2xl mb-4">Login</h2>
      <a-form @finish="handleSubmit" :model="form">
        <a-form-item name="username" :rules="[
          { required: true, message: 'Vui lòng nhập tên đăng nhập' },
          { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
        ]">
          <a-input v-model:value="form.username" placeholder="Tên đăng nhập" prefix-icon="user" />
        </a-form-item>
        <a-form-item name="password" :rules="[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
        ]">
          <a-input-password v-model:value="form.password" placeholder="Mật khẩu" prefix-icon="lock" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="w-full">
            Login
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch, useRuntimeConfig } from '#app';
import type { IUser } from '~/interfaces/IUser';
import { EUserRole } from '~/enums/EUserRole';

const router = useRouter();
const authStore = useAuthStore();
const { setUserInfo, setAccessToken } = authStore;
const config = useRuntimeConfig();

const form = reactive({
  username: '',
  password: '',
});

const handleSubmit = async (e: Event) => {
  try {
    const { data } = await useFetch<{ token: string, user: IUser }>('/api/login', {
      baseURL: config.public.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      method: 'POST',
      body: {
        email: form.username,
        password: form.password,
      },
      credentials:'include'
    });

    if (data.value && data.value.user && data.value.token && data.value.user.role == EUserRole.ADMIN) {
      setUserInfo(data.value.user);
      setAccessToken(data.value.token);
      console.log('Login successful:', data.value);
      notification.success({
        message: 'Đăng nhập thành công',
      });
      router.push('/admin');
      return
    }
    if(data.value && data.value.user && data.value.user.role != EUserRole.ADMIN)
    notification.error({
      message: 'Bạn không có quyền truy cập',
    });
    return;
  } catch (err) {
    notification.error({
      message: 'Có lỗi xảy ra',
    });
  }
};
</script>

<style></style>