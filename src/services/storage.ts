import { Injectable } from '@angular/core';
import { Config } from '../config';
import * as localForage from "localforage";

export interface StorageDriver {
    /**
     * The database of the storage provider.
     *
     * @type {any}
     */
    db: any;

    /**
     * Get an item from storage.
     *
     * @param  {string} key
     * @return {any}
     */
    get(key: string): Promise<any>;

    /**
     * Set an item to storage.
     *
     * @param {string} key
     * @param {any} value
     * @return {void}
     */
    set(key: string, value: any): Promise<any>;

    /**
     * Remove an item from storage.
     *
     * @param {string} key
     * @return {void}
     */
    remove(key: string): Promise<any>;

    /**
     * Clear storage.
     *
     * @return {void}
     */
    clear(): Promise<any>;
}

@Injectable()
export class Storage implements StorageDriver {
    /**
     * The database of the storage provider.
     *
     * @type {any}
     */
    db: any;

    /**
     * Create a new instance of the service.
     *
     * @param {Config} config
     */
    constructor(private config: Config) {
        this.db = localForage.createInstance({
            driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
            name: this.config.get('storage.name')
        });
    }

    /**
     * Get item from local storage.
     *
     * @return {any}
     */
    get(key: string): Promise<any> {
        return this.db.getItem(key);
    };

    /**
     * Set an item to local storage.
     *
     * @param {string} key
     * @param {any} value
     * @return {void}
     */
    set(key: string, value: any): Promise<any> {
        return this.db.setItem(key, value);
    };

    /**
     * Remove an item from local storage.
     *
     * @param  {string} key
     * @return {void}
     */
    remove(key: string): Promise<any> {
        return this.db.removeItem(key);
    };

    /**
     * Clear local storage.
     *
     * @return {void}
     */
    clear(): Promise<any> {
        return this.db.clear();
    };
}
