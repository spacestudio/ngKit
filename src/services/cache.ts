import { Injectable } from '@angular/core';
import { CacheItemModel } from '../models/index';
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
    static cacheName: string = 'ngkit_cache';

    /**
     * In memory collection of cache.
     *
     * @type {string}
     */
    static _cache = {};

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
            Cache._cache = null;
            this.clear();
        });
    }

    /**
     * Retrieve the stored cache.
     *
     * @return {any}
     */
    protected retrieveCache(): any {
        let cache = this.storage.get(Cache.cacheName);

        if (cache) {
            cache = JSON.parse(cache);
            Object.keys(cache).forEach((item) => {
                cache[item] = new CacheItemModel(cache[item])
            });

            return this.cache = cache;
        } else {
            return this.cache = this.store();
        }
    }

    /**
     * Save the cache to storage.
     *
     * @param  {string} key
     * @param  {any} value
     * @return {any}
     */
    protected store(): any {
        Cache.storeCache();

        return this.cache;
    }

    /**
     * Save the cache to storage.
     *
     * @param  {string} key
     * @param  {any} value
     * @return {any}
     */
    static storeCache(): any {
        LocalStorage.setItem(Cache.cacheName, JSON.stringify(this._cache));

        return Cache._cache;
    }

    /**
     * Accessor to the in memeory cache.
     *
     * @return {any}
     */
    get cache(): any {
        return Cache._cache;
    }

    /**
     * Mutator to the in memeory cache.
     *
     */
    set cache(value) {
        Cache._cache = value;
    }

    /**
     * Get an item from cache.
     *
     * @param  {string} key [description]
     * @return {any} [description]
     */
    get(key: string): any {
        if (this.cache[key] && !this.cache[key].isExpired()) {
            return this.cache[key].value;
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
        Cache.setItem(key, value, expires);
    }

    /**
     * Set an item to cache.
     *
     * @param  {string} key
     * @param  {any} value
     * @param  {number}
     * @return {void}
     */
    static setItem(
        key: string,
        value: any,
        expires: number = Config.getItem('cache.expires')
    ) {
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
        delete this.cache[key];
        this.store();
    }

    /**
     * Clear the cache.
     */
    clear(): void {
        this.storage.remove(Cache.cacheName);
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
