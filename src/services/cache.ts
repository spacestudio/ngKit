import { Injectable, OnDestroy } from '@angular/core';
import { CacheItemModel } from '../models/index';
import { Storage } from './storage';
import { Config } from './../config';
import { Event } from './event';

interface CacheInterface {
    [key: string]: CacheItemModel;
}

@Injectable()
export class Cache implements OnDestroy {
    /**
     * The name of the cache instance.
     */
    cacheName: string = 'ngkit_cache';

    /**
     * In memory collection of cache.
     */
    private _cache: CacheInterface = {};

    /**
     * Constructor.
     */
    constructor(
        private config: Config,
        private event: Event,
        private storage: Storage
    ) {
        this.retrieveCache();

        this.subs['auth:loggedOut'] = this.event.listen('auth:loggedOut')
            .subscribe(() => {
                this._cache = {};
                this.clear();
            });
    }

    /**
     * The subsciptions of the service.
     */
    subs: any = {};

    /**
     * On service destroy.
     */
    ngOnDestroy(): void {
        Object.keys(this.subs).forEach(k => this.subs[k].unsubscribe());
    }

    /**
     * Retrieve the stored cache.
     */
    protected retrieveCache(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.get(this.cacheName).then(cache => {
                if (cache) {
                    Object.keys(cache).forEach((item) => {
                        cache[item] = new CacheItemModel(cache[item])
                    });

                    this.cache = cache;
                } else {
                    this.cache = this.store();
                }

                resolve(this.cache);
            }, err => reject(err));
        });
    }

    /**
     * Save the cache to storage.
     *
     * @param  key
     * @param  value
     */
    store(): any {
        this.storage.set(this.cacheName, this._cache);

        return this._cache;
    }

    /**
     * Accessor to the in memeory cache.
     */
    get cache(): any {
        return this._cache;
    }

    /**
     * Mutator to the in memeory cache.
     *
     */
    set cache(value) {
        this._cache = value;
    }

    /**
     * Get an item from cache.
     *
     * @param   key
     * @param  defautValue
     */
    get(key: string, defautValue: any = null): any {
        if (this.cache[key] && !this.cache[key].isExpired()) {
            return this.cache[key].value;
        } else if (defautValue) {
            return defautValue;
        } else {
            this.remove(key);

            return null;
        }
    }

    /**
     * Set an item to cache.
     *
     * @param  key
     * @param  value
     * @param  expires
     */
    set(
        key: string,
        value: any,
        expires: number = this.config.get('cache.expires')
    ): void {
        let cacheItem = new CacheItemModel({ value: value, expires: expires });

        this._cache[key] = cacheItem;

        this.store();
    }

    /**
     * Remove an item from cache.
     *
     * @param key
     */
    remove(key: string): void {
        delete this.cache[key];
        this.store();
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
     * @param  key
     */
    pull(key: string): any {
        let value = this.get(key);
        this.remove(key);

        return value;
    }

    /**
     * Check if cache has an item.
     *
     * @param  key
     */
    has(key: string): boolean {
        return this.get(key) !== null ? true : false;
    }
}
