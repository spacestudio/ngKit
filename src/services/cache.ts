import { Injectable } from '@angular/core';
import { CacheItemModel } from '../models';
import { LocalStorage } from './storage';
import { Config } from './../config';
import { Event } from './event';

@Injectable()
export class Cache {
    /**
     * The name of the cache instance.
     *
     * @type {string}
     */
    protected cacheName: string = 'ngkit_cache';

    /**
     * In memory collection of cache.
     *
     * @type {string}
     */
    protected _cache: CacheItemModel[];

    /**
     * Constructor.
     */
    constructor(
        private config: Config,
        private event: Event,
        private storage: LocalStorage
    ) {
        this.retrieveCache();

        this.event.listen('auth:loggedOut').subscribe(() => {
            this.clear();
        });
    }

    /**
     * Retrieve the stored cache.
     *
     * @return {any}
     */
    protected retrieveCache(): any {
        let cache = JSON.parse(this.storage.get(this.cacheName));

        if (cache) {
            Object.keys(cache).forEach((item) => {
                cache[item] = new CacheItemModel(cache[item])
            });
        }

        return this._cache = JSON.parse(cache);
    }

    /**
     * Save the cache to storage.
     *
     * @param  {string} key
     * @param  {any} value
     * @return {any}
     */
    protected storeCache(): any {
        this.storage.set(this.cacheName, JSON.stringify(this._cache));

        return this._cache;
    }

    /**
     * Get an item from cache.
     *
     * @param  {string} key [description]
     * @return {any} [description]
     */
    get(key: string): any {
        if (this._cache[key] && !this._cache[key].isExpired()) {
            return this._cache[key].value;
        }

        this.remove(key);

        return null;

    }

    /**
     * Set an item to cache.
     *
     * @param  {string} key
     * @param  {any} value
     * @param  {number}
     * @return {void}
     */
    set(
        key: string,
        value: any,
        expires: number = this.config.get('cache.expires')
    ): void {
        let cacheItem = new CacheItemModel({
            value: value, expires: expires
        });
        this._cache[key] = cacheItem;
        this.storeCache();
    }

    /**
     * Remove an item from cache.
     *
     * @param {string} key
     */
    remove(key: string): void {
        delete this._cache[key];
        this.storeCache();
    }

    /**
     * Clear the cache.
     */
    clear(): void {
        this.storage.remove(this.cacheName);
    }

    /**
     * Get an item from cache and remove it.
     *
     * @param  {string} key
     * @return {any}
     */
    pull(key: string): any {
        let value = this.get(key);
        this.remove(key);

        return value;
    }

    /**
     * Check if cache has an item.
     *
     * @param  {string} key
     * @return {boolean}
     */
    has(key: string): boolean {
        return this.get(key) !== null ? true : false;
    }
}
