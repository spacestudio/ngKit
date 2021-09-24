import { StorageDriver } from './storage-driver';
import { ConfigSerivce } from '../../config.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Inject, Injectable } from '@angular/core';
import { UseStore } from 'idb-keyval';

@Injectable()
export class IDBStorageService implements StorageDriver {
  /**
   * The initialized state of the service.
   */
  initialized: boolean = false;

  /**
   * The storage methods of the service.
   */
  methods?: any;

  /**
   * The store of the storage provider.
   */
  store: UseStore = null;

  /**
   * Create a new instance of the storage driver.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private config: ConfigSerivce
  ) {
    this.init();
  }

  /**
   * Initialize the storage driver.
   */
  async init() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let { clear, createStore, del, get, set } = await import("idb-keyval");

    this.methods = { clear, del, get, set };

    this.store = createStore(this.config.get("storage.name"), "keyvaluepairs");
    this.initialized = true;
  }

  /**
   * Get item from local storage.
   */
  async get(key: string): Promise<any> {
    return await this.methods?.get(key, this.store);
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any): Promise<any> {
    return await this.methods?.set(key, value, this.store);
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<void> {
    return await this.methods?.del(key, this.store);
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<void> {
    return await this.methods?.clear(this.store);
  }
}
