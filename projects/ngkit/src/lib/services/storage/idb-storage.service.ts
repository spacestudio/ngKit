import { StorageDriver } from './storage-driver';
import { ConfigSerivce } from '../../config.service';
import { Injectable } from '@angular/core';
import {
  clear,
  createStore,
  del,
  get,
  set,
  UseStore
  } from 'idb-keyval';

@Injectable()
export class IDBStorageService implements StorageDriver {
  /**
   * The store of the storage provider.
   */
  store: UseStore = null;

  /**
   * Create a new instance of the storage driver.
   */
  constructor(private config: ConfigSerivce) {
    this.store = createStore(this.config.get("storage.name"), "keyvaluepairs");
  }

  /**
   * Get item from local storage.
   */
  async get(key: string): Promise<any> {
    return await get(key, this.store);
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any): Promise<any> {
    return await set(key, value, this.store);
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<void> {
    return await del(key, this.store);
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<void> {
    return await clear(this.store);
  }
}
