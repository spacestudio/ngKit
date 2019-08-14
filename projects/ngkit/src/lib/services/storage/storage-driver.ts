export interface StorageDriver {
  /**
   * The driver of the storage provider.
   */
  driver: any;

  /**
   * Get an item from storage.
   */
  get(key: string): Promise<any>;

  /**
   * Set an item to storage.
   */
  set(key: string, value: any): Promise<any>;

  /**
   * Remove an item from storage.
   */
  remove(key: string): Promise<any>;

  /**
   * Clear storage.
   */
  clear(): Promise<any>;
}
