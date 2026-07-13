class MemoryCache {
  private cache = new Map<string, { value: any; expiry: number | null }>();
  private version: number = Date.now();

  getVersion(): number {
    return this.version;
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  set(key: string, value: any, ttlMs: number | null = 300000): void { // Default to 5 minutes
    const expiry = ttlMs ? Date.now() + ttlMs : null;
    this.cache.set(key, { value, expiry });
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.version = Date.now();
  }

  clear(): void {
    this.cache.clear();
    this.version = Date.now();
  }
}

export const memoryCache = new MemoryCache();
