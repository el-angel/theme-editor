import { StorageManager } from '~/types/storage';

class StorageService implements StorageManager {
  public get<T>(key: string): Maybe<T> {
    const value = localStorage.getItem(key);

    if (!value) {
      return undefined;
    }

    return JSON.parse(value);
  }

  public set(key: string, data: unknown): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public keys(): string[] {
    return Object.keys(localStorage);
  }
}

const storage = new StorageService();

export default storage;
