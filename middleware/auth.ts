export default defineNuxtRouteMiddleware(async (to, from) => {
    const {isLogin} = storeToRefs(useAuthStore())
    if (!isLogin.value ) {
        if(useCookie('access_token').value){
            await useAuthStore().getUserInfo()
            return;
        }
        return navigateTo('/login');
    }
    return;
})