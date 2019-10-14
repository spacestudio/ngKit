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

    if (request && request.headers) {
      const cookies = this.getCookies(request.headers);

      if (cookies && cookies.hasOwnProperty(key)) {
        return Promise.resolve(cookies[key]);
      }
    }

    return Promise.resolve(this.driver.getItem(key));
  }

  /**
   * Get cookies from the request.
   */
  getCookies(headers: any): any {
    let cookies;

    for (var header in headers) {
      if (headers.hasOwnProperty(header) && 'cookie' == header.toLowerCase()) {
        cookies = headers[header]
        break;
      }
    }

    if (cookies) {
      return parseCookies(cookies);
    }
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any, options = {}): Promise<any> {
    if (typeof document === 'undefined') {
      return;
    }

    return await this.driver.setItem(key, value, options);
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<any> {
    if (typeof document === 'undefined') {
      return;
    }

    return await this.driver.removeItem(key);
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<any> {
    if (typeof document === 'undefined') {
      return;
    }

    return await this.driver.clear();
  }
}
