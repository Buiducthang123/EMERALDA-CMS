import { defineNuxtRouteMiddleware, useCookie, useRuntimeConfig } from '#app';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { IUser } from '~/interfaces/IUser';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const { setUserInfo, setAccessToken, user } = authStore;
  const router = useRouter();
  const tokenCookie = useCookie('access_token');
  const token = tokenCookie.value;

  if (token) {
    if (!user) { // Check if userInfo is already in state
      try {
        const user = await $fetch<IUser>('/api/user/info', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          baseURL: useRuntimeConfig().public.baseURL,
        });

        if (user) {
          setUserInfo(user);
          setAccessToken(token);
          if (to.path === '/login') {
            return router.push('/');
          }
        } else {
          setAccessToken('');
          tokenCookie.value = ''; // Clear the token cookie
          return router.push('/login');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setAccessToken('');
        tokenCookie.value = ''; // Clear the token cookie
        return router.push('/login');
      }
    } else {
      if (to.path === '/login') {
        return router.push('/');
      }
    }
  } else {
    if (to.path !== '/login') {
      return router.push('/login');
    }
  }
});