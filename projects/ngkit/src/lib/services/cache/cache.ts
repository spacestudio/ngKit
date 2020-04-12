import { Injectable, OnDestroy } from "@angular/core";
import { CacheItemModel } from "../../models";
import { LocalStorage } from "../storage/local";
import { Config } from "../../config";
import { Event } from "../event";
import { Subscription } from "rxjs";

@Injectable()
export class Cache implements OnDestroy {
  /**
   * Create a new instance of the service.
   */
  constructor(
    private config: Config,
    private event: Event,
    private localStorage: LocalStorage
  ) {
    this.retrieveCache();

    const loggedOutSub = this.event.listen("auth:loggedOut").subscribe(() => {
      this.clear();
    });

    this.subs.add(loggedOutSub);
  }

  /**
   * The name of the cache instance.
   */
  cacheName: string = "ngkit_cache";

  /**
   * In memory collection of cache.
   */
  private store: Map<string, any> = new Map();

  /**
   * The subsciptions of the service.
   */
  subs: Subscription = new Subscription();

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
    this.store.clear();
    await this.localStorage.remove(this.cacheName);
  }

  /**
   * Get an item from cache. If a a default item is provide and the item is not
   * found in the cache, the default item will be returned.
   */
  async get(key: string, defautValue: any = null): Promise<any> {
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
   * Get an item from cache and remove it.
   */
  async pull(key: string): Promise<any> {
    let value = await this.get(key);
    await this.remove(key);

    return value;
  }

  /**
   * Remove an item from cache.
   */
  async remove(key: string): Promise<void> {
    this.store.delete(key);
    await this.saveCache();
  }

  /**
   * Retrieve the stored cache.
   */
  protected async retrieveCache(): Promise<void> {
    try {
      const cache = await this.localStorage.get(this.cacheName);

      if (cache) {
        this.store = new Map(Object.entries(cache));
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store the cache in storage.
   */
  async saveCache(): Promise<any> {
    await this.localStorage.set(this.cacheName, this.store);

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
    this.store.set(key, new CacheItemModel({ value: value, expires: expires }));
    await this.saveCache();
  }
}
