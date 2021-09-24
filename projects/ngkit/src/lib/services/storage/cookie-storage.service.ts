import { StorageDriver } from './storage-driver';
import { ConfigSerivce } from '../../config.service';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import * as Cookies from 'es-cookie';

@Injectable()
export class CookieStorageService implements StorageDriver {
  /**
   * Create a new instance of the service.
   */
  constructor(public config: ConfigSerivce, private injector: Injector) {}

  /**
   * Get item from local storage.
   */
  async get(key: string): Promise<any> {
    const request = this.injector.get(new InjectionToken<any>("REQUEST"), {});

    if (request && request.headers) {
      const cookies = this.getCookies(request.headers);

      if (cookies && cookies.hasOwnProperty(key)) {
        return Promise.resolve(cookies[key]);
      }
    }

    if (typeof window === "undefined") {
      return;
    }

    return Promise.resolve(Cookies.get(key));
  }

  /**
   * Get item from local storage.
   */
  async has(key: string): Promise<boolean> {
    return new Boolean(await this.get(key)).valueOf();
  }

  /**
   * Get cookies from the request.
   */
  getCookies(headers: any): any {
    let cookies;

    for (var header in headers) {
      if (headers.hasOwnProperty(header) && "cookie" == header.toLowerCase()) {
        cookies = headers[header];
        break;
      }
    }

    if (cookies) {
      return this.parseCookies(cookies);
    }
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any, options = {}): Promise<any> {
    if (typeof window === "undefined") {
      return;
    }

    return await Cookies.set(key, value, {
      path: this.config.get("cookies.path"),
      sameSite: this.config.get("cookies.sameSite"),
      secure: this.config.get("cookies.secure"),
      ...options,
    });
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<any> {
    if (typeof window === "undefined") {
      return;
    }

    return await Cookies.remove(key);
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<any> {
    if (typeof window === "undefined") {
      return;
    }

    this.config
      .get("cookies.internalKeys")
      .forEach((k: string) => Cookies.remove(k));

    return;
  }

  /**
   * Parse cookies from a string.
   */
  protected parseCookies(s: string): { [key: string]: string } {
    if (s.length === 0) return {};
    const parsed: { [key: string]: string } = {};
    const pattern = new RegExp("\\s*;\\s*");
    s.split(pattern).forEach((i) => {
      const [encodedKey, encodedValue] = i.split("=");
      const key = decodeURIComponent(encodedKey);
      const value = decodeURIComponent(encodedValue);
      parsed[key] = value;
    });

    return parsed;
  }
}
