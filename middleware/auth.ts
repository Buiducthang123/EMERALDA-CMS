export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isLogin } = storeToRefs(useAuthStore())
    if(!isLogin.value)
    {
        return navigateTo('/login');
    }
    return;
})