export const useUser = defineStore('user', {
    state: () => {
        return {
            isLoggedIn: false,
            username: null as string | null,

        };
    },
    persist: true,
    getters: {

    },
    actions: {
        logout() {
            this.isLoggedIn = false;
            this.username = null;
            console.log("isLoggedin", this.isLoggedIn)

            useRouter().push({ path: '/login' })
        }
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}