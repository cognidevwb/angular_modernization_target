/**
 * angular-storage's `store`, as the legacy app used it (caching off): each
 * value JSON in localStorage under its key. The same keys and encoding, so a
 * token the legacy app stored is read as it was.
 */
export const store = {
  get(key: string): any {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  },
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
};
