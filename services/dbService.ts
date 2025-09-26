import { HistoryItem } from '../App';

const DB_NAME = 'KOLStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let db: IDBDatabase;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export async function addImage(item: HistoryItem): Promise<HistoryItem> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(item);

    request.onsuccess = () => {
      // The result of an add operation is the new key.
      const newItem = { ...item, id: request.result as number };
      resolve(newItem);
    };

    request.onerror = () => {
      console.error('Error adding item:', request.error);
      reject(request.error);
    };
  });
}

export async function getAllImages(): Promise<HistoryItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    // Use getAll() which is more efficient
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort descending by id to get newest first
      resolve(request.result.reverse());
    };

    request.onerror = () => {
      console.error('Error getting all items:', request.error);
      reject(request.error);
    };
  });
}

export async function deleteImage(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Error deleting item:', request.error);
      reject(request.error);
    };
  });
}
