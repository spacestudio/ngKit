import { IDBStorageService } from './idb-storage.service';
import { LocalStorageService } from './local-storage.service';
import { StorageDriver } from './storage-driver';
import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class StorageService implements StorageDriver {
  /**
   * The storage driver of the service.
   */
  driver?: IDBStorageService | LocalStorageService | StorageDriver;

  /**
   * The load promise.
   */
  load?: Promise<void>;

  /**
   * Create a new instance of the service.
   */
  constructor(private injector: Injector) {
    this.init();
  }

  /**
   * Initialize the service by selecting the best storage driver.
   */
  init() {
    this.load = new Promise(async (resolve) => {
      if (typeof window !== "undefined" && window.indexedDB) {
        this.driver = this.injector.get(IDBStorageService);
      } else if (typeof window !== "undefined" && window.localStorage) {
        this.driver = this.injector.get(LocalStorageService);
      }

      if (typeof (<any>this.driver) !== "undefined") {
        await (<any>this.driver).load;
      }

      resolve();
    });
  }

  /**
   * Get an item from storage.
   */
  async get(key: string): Promise<any> {
    await this.load;
    return this.driver?.get(key);
  }

  /**
   * Set an item to storage.
   */
  async set(key: string, value: any): Promise<any> {
    await this.load;
    return this.driver?.set(key, value);
  }

  /**
   * Remove an item from storage.
   */
  async remove(key: string): Promise<any> {
    await this.load;
    return this.driver?.remove(key);
  }

  /**
   * Clear storage.
   */
  async clear(): Promise<any> {
    await this.load;
    return this.driver?.clear();
  }
}
