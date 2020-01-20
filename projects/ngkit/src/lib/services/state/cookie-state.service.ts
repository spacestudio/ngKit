import { Injectable } from '@angular/core';
import { CookieStorage } from '../storage/cookie';

@Injectable({
  providedIn: 'root'
})
export class CookieState {
  /**
   * Create a new instance of the service.
   */
  constructor(private cookieStorage: CookieStorage) {
    this.init();
  }

  /**
   * The saved state of the service.
   */
  state: any = {};

  /**
   * The storage key for the service.
   */
  static storageKey: string = '_ngkstate';

  /**
   * Clear the state.
   */
  async clear(): Promise<void> {
    await this.cookieStorage.remove(CookieState.storageKey);
  }

  /**
   * Get a value from the saved state.
   * @param key
   */
  async get(key: string): Promise<any> {
    return this.state[key] || null;
  }

  /**
   * Initialize the service.
   */
  private async init(): Promise<void> {
    await this.restore();
  }

  /**
   * Restore the state from the browser cookie.
   */
  async restore(): Promise<void> {
    if (!await this.cookieStorage.has(CookieState.storageKey)) {
      return;
    }

    const storedValue = await this.cookieStorage.get(CookieState.storageKey);

    if (storedValue) {
      this.state = JSON.parse(typeof Buffer !== 'undefined' ?
        Buffer.from(storedValue, 'base64').toString('utf8') : atob(storedValue));
    }
  }
  /**
   * Remove a key from the state.
   *
   * @param  key
   */
  async remove(key: string): Promise<void> {
    delete this.state[key];
    await this.store();
  }

  /**
   * Set a key to the saved state.
   *
   * @param key
   * @param value
   */
  async set(key: string, value: any): Promise<any> {
    this.state[key] = value;
    await this.store();
  }

  /**
   * Store the saved state in a browser cookie.
   */
  async store(): Promise<void> {
    let state = JSON.stringify(this.state);
    state = typeof Buffer !== 'undefined' ? Buffer.from(state, 'utf8').toString('base64') : btoa(state);

    await this.cookieStorage.set(CookieState.storageKey, state, {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Strict',
    })
  }
}
