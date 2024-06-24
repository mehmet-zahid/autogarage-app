export const useUser = defineStore('user', {
    state: () => {
        return {
            isAuthenticated: false,
            username: null as string | null,

        };
    },
    persist: true,
    getters: {

    },
    actions: {
        logout() {
            this.isAuthenticated = false;
            this.username = null;
            console.log("isAutenticated", this.isAuthenticated)

            useRouter().push({ path: '/login' })
        }
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}