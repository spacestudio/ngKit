import { Injectable, Injector } from '@angular/core';
import { Config } from '../../config';
import { CookieStorage as CookieStore, parseCookies } from 'cookie-storage';
import { StorageDriver } from './storage-driver';

@Injectable()
export class CookieStorage implements StorageDriver {
  /**
   * The driver of the storage provider.
   */
  driver: CookieStore;

  /**
   * Create a new instance of the service.
   */
  constructor(
    public config: Config,
    private injector: Injector
  ) {
    this.driver = new CookieStore({
      path: this.config.get('cookies.path'),
      sameSite: this.config.get('cookies.sameSite'),
      secure: this.config.get('cookies.secure'),
    });
  }

  /**
   * Get item from local storage.
   */
  async get(key: string): Promise<any> {
    const request = this.injector.get('REQUEST', {});

    if (request && request.headers && request.headers.cookie) {
      const parsed = parseCookies(request.headers.cookie);

      if (parsed && parsed.hasOwnProperty(key)) {
        return Promise.resolve(parsed[key]);
      }
    }

    return Promise.resolve(this.driver.getItem(key));
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any, options = {}): Promise<any> {
    return await this.driver.setItem(key, value, options);
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<any> {
    return await this.driver.removeItem(key);
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<any> {
    return await this.driver.clear();
  }
}
