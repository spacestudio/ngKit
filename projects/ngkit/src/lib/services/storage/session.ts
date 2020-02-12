import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { StorageDriver } from './storage-driver';

@Injectable()
export class SessionStorage implements StorageDriver {

  /**
   * Create a new instance of the service.
   */
  constructor(private config: Config) {

  }

  /**
   * Get item from session storage.
   */
  async get(key: string): Promise<any> {
    await this.load;

    if (window?.sessionStorage) {
      return await sessionStorage.getItem(key);
    }
  }

  /**
   * Set an item to session storage.
   */
  async set(key: string, value: any): Promise<any> {
    if (window?.sessionStorage) {
      return await sessionStorage.setItem(key, value);
    }
  }

  /**
   * Remove an item from session storage.
   */
  async remove(key: string): Promise<void> {
    if (window?.sessionStorage) {
      return await sessionStorage.removeItem(key);
    }
  }

  /**
   * Clear session storage.
   */
  async clear(): Promise<void> {
    if (window?.sessionStorage) {
      return await sessionStorage.clear();
    }
  }
}
