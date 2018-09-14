export interface StorageDriver {
    /**
     * The database of the storage provider.
     */
    db: any;

    /**
     * Get an item from storage.
     *
     * @param   key
     */
    get(key: string): Promise<any>;

    /**
     * Set an item to storage.
     *
     * @param  key
     * @param  value
     */
    set(key: string, value: any): Promise<any>;

    /**
     * Remove an item from storage.
     *
     * @param key
     */
    remove(key: string): Promise<any>;

    /**
     * Clear storage.
     */
    clear(): Promise<any>;
}
