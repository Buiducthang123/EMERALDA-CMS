<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
    <a-card class="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-center text-3xl font-bold text-gray-800 mb-6">QLKS</h2>
        <a-form @finish="handleSubmit" :model="form" layout="vertical" class="space-y-6">
          <a-form-item name="username" :rules="usernameRules">
            <a-input size="large" v-model:value="form.username" placeholder="Tên đăng nhập" prefix-icon="user" />
          </a-form-item>
          <a-form-item name="password" :rules="passwordRules">
            <a-input-password size="large" v-model:value="form.password" placeholder="Mật khẩu" prefix-icon="lock" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="w-full">
              Login
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch, useRuntimeConfig } from '#app';
import type { IUser } from '~/interfaces/IUser';
import { EUserRole } from '~/enums/EUserRole';
import { useAuthStore } from '~/stores/auth';
import { notification } from 'ant-design-vue';

const router = useRouter();
const authStore = useAuthStore();
const { setUserInfo, setAccessToken } = authStore;
const config = useRuntimeConfig();

const form = reactive({
  username: '',
  password: '',
});

const usernameRules: any = [
  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
  { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
];

const passwordRules = [
  { required: true, message: 'Vui lòng nhập mật khẩu' },
  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
];

const handleSubmit = async () => {
  try {
    await $fetch<{ token: string, user: IUser }>('/api/login', {
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
      onResponse: ({ response }) => {
        if (response.ok) {
          if (response._data.user.role == EUserRole.ADMIN) {
            setUserInfo(response._data.user);
            setAccessToken(response._data.token);
            notification.success({
              message: 'Đăng nhập thành công',
            });
            router.push('/');
          } else {
            notification.error({
              message: 'Bạn không có quyền truy cập',
            });
          }
        } else {
          notification.error({
            message: 'Có lỗi xảy ra',
          });
        }
      },
    });
  } catch (err: any) {
    notification.error({
      message: err.message || 'Có lỗi xảy ra',
    });
  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>