import Database from '@tauri-apps/plugin-sql';

let dbInstance: Database | null = null;

export const loadDatabase = async (): Promise<Database> => {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:auto-repair-shop.db");
  }
  return dbInstance;
};
