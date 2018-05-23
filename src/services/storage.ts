import { Injectable } from '@angular/core';
import { Config } from '../config';
import * as localForage from "localforage";

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

@Injectable()
export class Storage implements StorageDriver {
    /**
     * The database of the storage provider.
     */
    db: any;

    /**
     * Create a new instance of the service.
     *
     * @param config
     */
    constructor(private config: Config) {
        this.db = localForage.createInstance({
            name: this.config.get('storage.name')
        });
    }

    /**
     * Get item from local storage.
     */
    get(key: string): Promise<any> {
        return this.db.getItem(key);
    }

    /**
     * Set an item to local storage.
     *
     * @param  key
     * @param  value
     */
    set(key: string, value: any): Promise<any> {
        return this.db.setItem(key, value);
    }

    /**
     * Remove an item from local storage.
     *
     * @param   key
     */
    remove(key: string): Promise<any> {
        return this.db.removeItem(key);
    }

    /**
     * Clear local storage.
     */
    clear(): Promise<any> {
        return this.db.clear();
    }
}
