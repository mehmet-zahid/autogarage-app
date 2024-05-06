export const useUser = defineStore('user', {
    state: () => {
        return {
            isLoggedIn: false,
            user: null,

        };
    },
    persist: true,
    getters: {

    },
    actions: {
        logout() {
            this.isLoggedIn = false;
            this.user = null;
            console.log("isLoggedin", this.isLoggedIn)

            useRouter().push({ path: '/login' })
        },
        getAuthorizationHeader(): string | null {
            return this.user ? `Bearer ${this.user.token}` : null;
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}