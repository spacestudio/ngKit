import { ConfigSerivce } from '../../config.service';
import { CacheItemModel } from '../../models';
import { EventSerivce } from '../event.service';
import { IDBStorageService } from '../storage/idb-storage.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class CacheService implements OnDestroy {
  /**
   * The name of the cache instance.
   */
  cacheName: string = "ngkit_cache";

  /**
   * The load promise.
   */
  load: Promise<void>;

  /**
   * In memory collection of cache.
   */
  private store: Map<string, any> = new Map();

  /**
   * The subsciptions of the service.
   */
  subs: Subscription = new Subscription();

  /**
   * Create a new instance of the service.
   */
  constructor(
    private config: ConfigSerivce,
    private eventService: EventSerivce,
    private idb: IDBStorageService
  ) {
    this.init();
  }

  /**
   * On service destroy.
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Clear the cache.
   */
  async clear(): Promise<void> {
    await this.load;
    this.store.clear();
    await this.idb.remove(this.cacheName);
  }

  /**
   * Get an item from cache. If a a default item is provide and the item is not
   * found in the cache, the default item will be returned.
   */
  async get(key: string, defautValue: any = null): Promise<any> {
    await this.load;

    if (this.store.has(key) && !this.store.get(key).isExpired()) {
      return this.store.get(key).value;
    } else if (defautValue) {
      return defautValue;
    } else {
      await this.remove(key);

      return null;
    }
  }

  /**
   * Check if cache has an item.
   */
  has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Initialize the service.
   */
  protected init() {
    this.load = new Promise(async (resolve) => {
      await this.retrieveCache();
      const loggedOutSub = this.eventService
        .listen("auth:loggedOut")
        .subscribe(() => this.clear());

      this.subs.add(loggedOutSub);
      resolve();
    });
  }

  /**
   * Get an item from cache and remove it.
   */
  async pull(key: string): Promise<any> {
    await this.load;
    let value = await this.get(key);
    await this.remove(key);

    return value;
  }

  /**
   * Remove an item from cache.
   */
  async remove(key: string): Promise<void> {
    await this.load;
    this.store.delete(key);
    await this.saveCache();
  }

  /**
   * Refresh te cache from storage.
   */
  async refresh() {
    await this.retrieveCache();
  }

  /**
   * Retrieve the stored cache.
   */
  protected async retrieveCache(): Promise<void> {
    try {
      const cache = await this.idb.get(this.cacheName);

      if (cache) {
        cache.forEach((value, key, map) => {
          map.set(key, new CacheItemModel(value));
        });

        this.store = cache;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store the cache in storage.
   */
  async saveCache(): Promise<any> {
    await this.load;
    await this.idb.set(this.cacheName, this.store);

    return this.store;
  }

  /**
   * Set an item to cache. Expiration is time in seconds.
   */
  async set(
    key: string,
    value: any,
    expires: number = this.config.get("cache.expires")
  ): Promise<void> {
    await this.load;
    this.store.set(key, new CacheItemModel({ value: value, expires: expires }));
    await this.saveCache();
  }
}
