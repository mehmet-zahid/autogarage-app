
const _username = useLocalStorage("username", "")
const isAuthenticated = useLocalStorage("isAuthenticated", false)
import { User } from "@element-plus/icons-vue";
import { invoke } from "@tauri-apps/api/core";
import { Window } from '@tauri-apps/api/window';

export const useBackend = async () => {
    const { getUsers, getUserByName } = await useDatabase();
    const login = async (username: string, password: string): Promise<boolean> => {
        //const users = await getUsers();
        //const user = users.find(user => user.username === username && user.password === password);
        const user = await getUserByName(username);
        console.log(user)

        if (user && user.password === password) {
            _username.value = user.username
            isAuthenticated.value = true
            return true;
        }
        throw new Error("Kullanıcı adı veya şifre hatalı!");
    };

    const logout = async () => {
        _username.value = ""
        isAuthenticated.value = false
        useRouter().push({ path: '/login' })
    };

    const shutdown = async () => {
        try {
            // Perform any necessary cleanup operations here, such as saving state, closing database connections, etc.
            
            // Close the Tauri window
            const window = Window.getCurrent();
            useShowToast("Program Kapatılıyor...", "warning");
            await new Promise(resolve => setTimeout(resolve, 10000));
            await window.close();
            
            // Exit the Tauri application
            await invoke('plugin:app|exit');
          } catch (error) {
            console.error('Failed to shutdown the app:', error);
          }
    };


    return {
        login,
        logout,
        shutdown
    };
}