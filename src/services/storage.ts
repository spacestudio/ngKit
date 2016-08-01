import { Injectable } from '@angular/core';

export interface Storage {
    /**
     * Get an item from storage.
     *
     * @param  {string} key
     * @return {any}
     */
    get(key: string): any;

    /**
     * Set an item to storage.
     *
     * @param {string} key
     * @param {any} value
     * @return {void}
     */
    set(key: string, value: any): void;

    /**
     * Remove an item from storage.
     *
     * @param {string} key
     * @return {void}
     */
    remove(key: string): void;

    /**
     * Clear storage.
     *
     * @return {void}
     */
    clear(): void;
}

@Injectable()
export class LocalStorage implements Storage {
    /**
     * Get item from localstorage.
     *
     * @return {any}
     */
    get(key: string): any {
        return LocalStorage.getItem(key);
    };

    /**
     * Static method to get item from localStorage.
     *
     * @param  {string} key
     * @return {any}
     */
    static getItem(key: string): any {
        return localStorage.getItem(key);
    }

    /**
     * Set an item to localStorage.
     *
     * @param {string} key
     * @param {any} value
     * @return {void}
     */
    set(key: string, value: any): void {
        LocalStorage.setItem(key, value);
    };

    /**
     * Static method to an set item to localStorage.
     *
     * @param  {string} key
     * @return {any}
     */
    static setItem(key: string, value: any): void {
        localStorage.setItem(key, value);
    }

    /**
     * Remove an item from localStorage.
     *
     * @param  {string} key
     * @return {void}
     */
    remove(key: string): void {
        localStorage.removeItem(key);
    };

    /**
     * Clear localStorage.
     *
     * @return {void}
     */
    clear() {
        localStorage.clear();
    };
}
