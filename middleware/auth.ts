export default defineNuxtRouteMiddleware((to, from)=> {
    const { isAuthenticated } = useUser();
    
    //console.log("STORE:isLoggedIn", userStore.isLoggedIn)
    //const cookie_auth = useCookie('user').value ? useCookie('user').value.isLoggedIn : false
    //console.log("COOKIE:isLoggedIn", cookie_auth)
    
       
        if (!isAuthenticated && to.path !== '/login') {
            return navigateTo('/login')
        }

        if (to.path === '/' || to.path === '/login') {
            return navigateTo('/oto/dashboard')
        }
    
})