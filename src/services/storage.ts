import { Injectable } from '@angular/core';
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
    db = localForage.config({
        name: 'ngkitStorage'
    });

    /**
     * Get item from local storage.
     *
     * @return {any}
     */
    get(key: string): Promise<any> {
        return Storage.getItem(key);
    };

    /**
     * Static method to get item from local storage.
     *
     * @param  {string} key
     * @return {any}
     */
    static getItem(key: string): Promise<any> {
        return localForage.getItem(key);
    }

    /**
     * Set an item to local storage.
     *
     * @param {string} key
     * @param {any} value
     * @return {void}
     */
    set(key: string, value: any): Promise<any> {
        return Storage.setItem(key, value);
    };

    /**
     * Static method to an set item to local storage.
     *
     * @param  {string} key
     * @return {any}
     */
    static setItem(key: string, value: any): Promise<any> {
        return localForage.setItem(key, value);
    }

    /**
     * Remove an item from local storage.
     *
     * @param  {string} key
     * @return {void}
     */
    remove(key: string): Promise<any> {
        return localForage.removeItem(key);
    };

    /**
     * Clear local storage.
     *
     * @return {void}
     */
    clear(): Promise<any> {
        return localForage.clear();
    };
}
