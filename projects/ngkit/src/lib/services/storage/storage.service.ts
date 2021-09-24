import { StorageDriver } from './storage-driver';
import { IDBStorageService, LocalStorageService } from '.';
import { Inject, Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class StorageService implements StorageDriver {
  /**
   * The storage driver of the service.
   */
  driver: StorageDriver;

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
    if (typeof window !== "undefined" && window.indexedDB) {
      this.driver = this.injector.get(IDBStorageService);
    } else if (typeof window !== "undefined" && window.localStorage) {
      this.driver = this.injector.get(LocalStorageService);
    }
  }

  /**
   * Get an item from storage.
   */
  get(key: string): Promise<any> {
    return this.driver.get(key);
  }

  /**
   * Set an item to storage.
   */
  set(key: string, value: any): Promise<any> {
    return this.driver.set(key, value);
  }

  /**
   * Remove an item from storage.
   */
  remove(key: string): Promise<any> {
    return this.driver.remove(key);
  }

  /**
   * Clear storage.
   */
  clear(): Promise<any> {
    return this.driver.clear();
  }
}
