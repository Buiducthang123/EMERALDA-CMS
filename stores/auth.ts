import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { EUserRole } from '~/enums/EUserRole'
import type { IUser } from "~/interfaces/IUser"

export const useAuthStore = defineStore('auth', () => {
    const accessToken = useCookie<string | undefined>('access_token')
    const refreshToken = useCookie<string | undefined>('refresh_token')
    
    const user = ref<IUser | undefined | null>()

    const isLogin = computed(() => (user.value && accessToken.value ))

    const isAdmin = computed(() => (user.value && user.value.role === EUserRole.ADMIN ))

    const setAccessToken = (token?: string) => {
        const accessToken = useCookie('access_token')
        accessToken.value = token
    }

    const setUserInfo = (userInfo: IUser) => {
        user.value = userInfo
    }

    const setRefreshToken = (token?: string) => {
        refreshToken.value = token
    }

    const logout = async () => {
        accessToken.value = undefined
        refreshToken.value = undefined
        user.value = undefined
        const userCookie = useCookie('user')
        userCookie.value = null
    }

    async function getUserInfo() {
      try {
        const accessToken = useCookie('access_token')
        
        if (accessToken.value) {
          const { data: userData } = await useFetch<IUser>('api/users/info', {
            baseURL: useRuntimeConfig().public.baseURL,
            headers: {
              Authorization: `Bearer ${accessToken.value}`,
              'Content-Type': 'application/json'
            },
            method: 'GET'
          })
          
          if (userData.value && userData.value.role == EUserRole.ADMIN) {
            user.value = userData.value
            console.log('User info:', user.value);
            return
          }
          notification.error({message: 'Unauthorized', description: 'You are not authorized to access this page'})
          
        } else {
          user.value = undefined
        }
      } catch (e) {
        console.error('Error occurred:', e)
        user.value = undefined
      }
    }

    async function checkAuth() {
        if (accessToken.value && !user.value) {
            await getUserInfo()
        }
    }

    return {
        accessToken,
        refreshToken,
        setAccessToken,
        setRefreshToken,
        setUserInfo,
        user,
        isLogin,
        isAdmin,
        logout,
        getUserInfo,
        checkAuth
    }
})