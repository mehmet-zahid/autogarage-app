const { getUsers } = useDatabase();

export const useBackend = () => {
    const login = async (username: string, password: string): Promise<boolean> => {
        const users = await getUsers();
        const user = users.find(user => user.username === username && user.password === password);
        
        if (user) {
            
            const userStore = useUser();
            userStore.username = user.username;
            userStore.isLoggedIn = true;
            return true;
        }
        return false;
      };

    return {
        login,
    };
}