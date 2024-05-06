export const useBackend = () => {
    const login = async (username: string, password: string): Promise<boolean> => {
        
        if (username === 'admin' && password === 'admin') {
            const userStore = useUser();
            userStore.user = username;
            userStore.isLoggedIn = true;
            return true;
        }
        return false;
      };

    return {
        login,
    };
}