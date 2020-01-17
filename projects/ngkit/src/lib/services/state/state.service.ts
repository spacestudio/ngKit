import { Injectable } from '@angular/core';
import { CookieStorage } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  /**
   * Create a new instance of the service.
   */
  constructor(private cookieStorage: CookieStorage) {
    this.init();
  }

  /**
   * The saved state of the service.
   */
  state: any;

  /**
   * The storage key for the service.
   */
  static storageKey: string = '_ngkstate';

  /**
   * Get a value from the saved state.
   * @param key
   */
  async get(key: string): Promise<any> {
    return this.state[key];
  }

  /**
   * Initialize the service.
   */
  async init(): Promise<void> {
    await this.restore();
  }

  /**
   * Restore the state from the browser cookie.
   */
  async restore(): Promise<void> {
    this.state = await this.cookieStorage.get(StateService.storageKey);
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
    await this.cookieStorage.set('_ngkstate', state)
  }
}
