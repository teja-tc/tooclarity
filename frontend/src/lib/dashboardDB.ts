// src/lib/dashboardDB.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";

// Define your DB schema
interface DashboardDBSchema extends DBSchema {
  fullData: {
    key: string;       // e.g., "fullDashboardData"
    value: any;        // the dashboard JSON object
  };
}

let dbPromise: Promise<IDBPDatabase<DashboardDBSchema>>;

export const getDashboardDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<DashboardDBSchema>("dashboardDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("fullData")) {
          db.createObjectStore("fullData");
        }
      },
    });
  }
  return dbPromise;
};

// Save data
export const saveFullDashboardData = async (key: string, data: any) => {
  const db = await getDashboardDB();
  await db.put("fullData", data, key);
};

// Get data
export const getFullDashboardData = async (key: string) => {
  const db = await getDashboardDB();
  return db.get("fullData", key);
};

// Delete data
export const deleteFullDashboardData = async (key: string) => {
  const db = await getDashboardDB();
  return db.delete("fullData", key);
};


// Get all keys from the "fullData" object store
export const getAllDashboardKeys = async () => {
  const db = await getDashboardDB();
  const keys = await db.getAllKeys("fullData");
  console.log("🔑 Keys in fullData store:", keys);
  return keys;
};
