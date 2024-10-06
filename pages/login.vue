<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <a-card class="w-full max-w-md">
      <h2 class="text-center text-2xl mb-4">Login</h2>
      <a-form @finish="handleSubmit" :model="form">
        <a-form-item name="username" :rules="usernameRules">
          <a-input v-model:value="form.username" placeholder="Tên đăng nhập" prefix-icon="user" />
        </a-form-item>
        <a-form-item name="password" :rules="passwordRules">
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

const usernameRules = [
  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
  { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
];

const passwordRules = [
  { required: true, message: 'Vui lòng nhập mật khẩu' },
  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
];

const handleSubmit = async () => {
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
      credentials: 'include',
      onResponse: ({ response }) => {
        if (response.status === 200) {
          console.log(response._data);
          
          if (response._data.user.role === EUserRole.ADMIN) {
            setUserInfo(response._data.user);
            setAccessToken(response._data.token);
            notification.success({
              message: 'Đăng nhập thành công',
            });
            router.push('/');
          } else {
            throw new Error('Bạn không có quyền truy cập');
          }
        } else if (response.status === 404) {
          throw new Error('Không tìm thấy trang');
        }
      }
    });
  } catch (err: any) {
    notification.error({
      message: err.message || 'Có lỗi xảy ra',
    });
  }
};
</script>

<style scoped></style>