import { StorageDriver } from './storage-driver';
import { ConfigSerivce } from '../../config.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService implements StorageDriver {
  /**
   * Create a new instance of the service.
   */
  constructor(private config: ConfigSerivce) {}

  /**
   * Get item from session storage.
   */
  async get(key: string): Promise<any> {
    if (window !== undefined && window.sessionStorage) {
      return await sessionStorage.getItem(key);
    }
  }

  /**
   * Set an item to session storage.
   */
  async set(key: string, value: any): Promise<any> {
    if (window !== undefined && window.sessionStorage) {
      return await sessionStorage.setItem(key, value);
    }
  }

  /**
   * Remove an item from session storage.
   */
  async remove(key: string): Promise<void> {
    if (window !== undefined && window.sessionStorage) {
      return await sessionStorage.removeItem(key);
    }
  }

  /**
   * Clear session storage.
   */
  async clear(): Promise<void> {
    if (window !== undefined && window.sessionStorage) {
      return await sessionStorage.clear();
    }
  }
}
