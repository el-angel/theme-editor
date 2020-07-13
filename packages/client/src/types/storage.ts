export interface StorageManager {
  set: <T>(key: string, data: T) => void;
  get: <T>(key: string) => Maybe<T>;
  remove: (key: string) => void;
  keys: () => string[];
}
