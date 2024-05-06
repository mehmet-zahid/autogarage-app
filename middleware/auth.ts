export default defineNuxtRouteMiddleware((to, from)=> {
    const userStore = useUser();
    
    //console.log("STORE:isLoggedIn", userStore.isLoggedIn)
    //const cookie_auth = useCookie('user').value ? useCookie('user').value.isLoggedIn : false
    //console.log("COOKIE:isLoggedIn", cookie_auth)
    try {

        if (userStore.isLoggedIn) {
            if (to.path === '/'){
                return navigateTo('/oto/dashboard')
            }
            if (to.path === '/login') {
                return navigateTo('/oto/dashboard')
            }
            if (to.path === '/oto') {
                return navigateTo('/oto/dashboard')
            }
        }
        else {
            return navigateTo('/login')

        }

        //if (to.path === '/login') {
        //
        //    if (userStore.isLoggedIn) {
        //        return navigateTo('/oto/dashboard')
        //    }
        //    else {
        //        return
        //    }
        //}
//
        //// login dışındaki herhangi bir path e gidiyorsa
        //// login olmuşsa
        //if (!userStore.isLoggedIn) {
        //    return navigateTo('/login')
        //}
        //// login olmamışsa
        //if (to.path === '/oto') {
        //    return navigateTo('/oto/dashboard')
        //}
//
        //return
        
    } catch (error) {
        console.log(error)
        
    }
    
})