import { StorageDriver } from './storage-driver';
import { Config } from '../../config';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorage implements StorageDriver {
  /**
   * Create a new instance of the service.
   */
  constructor(private config: Config) {}

  /**
   * Get item from local storage.
   */
  async get(key: string): Promise<any> {
    return Promise.resolve(
      JSON.parse(
        localStorage.getItem(`${this.config.get("storage.name")}/${key}`)
      )
    );
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any): Promise<any> {
    return Promise.resolve(
      localStorage.setItem(
        `${this.config.get("storage.name")}/${key}`,
        JSON.stringify(value)
      )
    );
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<void> {
    return Promise.resolve(
      localStorage.removeItem(`${this.config.get("storage.name")}/${key}`)
    );
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<void> {
    return Promise.resolve(localStorage.clear());
  }
}
