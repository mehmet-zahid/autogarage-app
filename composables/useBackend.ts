
import  Database  from '@tauri-apps/plugin-sql';
import type { UserLogin } from '~/types/business';


const db = await Database.load('sqlite:auto-repair-shop.db');
const dbName = 'auto-repair-shop.db';
  const tables = {
    userlogin: 'userlogin',
  };

  async function getUsers(): Promise<UserLogin[]> {
    const query = `SELECT * FROM ${tables.userlogin}`;
    const results = await db.select(query);
    return results;
  }



export const useBackend = () => {
    const login = async (username: string, password: string): Promise<boolean> => {
        const users = await getUsers();
        const user = users.find(user => user.username === username && user.password === password);
        
        if (user) {
            
            const userStore = useUser();
            userStore.user = user.username;
            userStore.isLoggedIn = true;
            return true;
        }
        return false;
      };

    return {
        login,
    };
}