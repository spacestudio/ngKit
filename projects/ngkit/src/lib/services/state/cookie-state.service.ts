import { ConfigSerivce } from '../../config.service';
import { CookieStorageService } from '../storage/cookie-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class CookieState {
  /**
   * Create a new instance of the service.
   */
  constructor(
    private config: ConfigSerivce,
    private cookieStorageService: CookieStorageService
  ) {
    this.load = new Promise(async (resolve) => {
      if (this.state) {
        return resolve();
      }

      await this.init();
      resolve();
    });
  }

  /**
   * The load promise.
   */
  load: Promise<void>;

  /**
   * The saved state of the service.
   */
  state: any = null;

  /**
   * The storage key for the service.
   */
  static storageKey: string = "_ngkstate";

  /**
   * Clear the state.
   */
  async clear(): Promise<void> {
    await this.load;
    await this.cookieStorageService.remove(CookieState.storageKey);
  }

  /**
   * Get a value from the saved state.
   */
  async get(key: string): Promise<any> {
    await this.load;
    return this.state[key] || null;
  }

  /**
   * The expiration of the cookie state.
   */
  getExpiration(): Date | null {
    if (!this.config.get("authentication.shouldRemember")) {
      return null;
    }

    return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
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
    if (!(await this.cookieStorageService.has(CookieState.storageKey))) {
      this.state = {};

      return;
    }

    const storedValue = await this.cookieStorageService.get(
      CookieState.storageKey
    );

    if (storedValue) {
      this.state = JSON.parse(
        typeof Buffer !== "undefined"
          ? Buffer.from(storedValue, "base64").toString("utf8")
          : atob(storedValue)
      );
    } else {
      this.state = {};
    }
  }

  /**
   * Remove a key from the state.
   */
  async remove(key: string): Promise<void> {
    await this.load;
    delete this.state[key];
    await this.store();
  }

  /**
   * Set a key to the saved state.
   */
  async set(key: string, value: any): Promise<any> {
    await this.load;
    this.state[key] = value;
    await this.store();
  }

  /**
   * Store the saved state in a browser cookie.
   */
  async store(): Promise<void> {
    await this.load;
    let state = JSON.stringify(this.state);
    state =
      typeof Buffer !== "undefined"
        ? Buffer.from(state, "utf8").toString("base64")
        : btoa(state);

    await this.cookieStorageService.set(CookieState.storageKey, state, {
      expires: this.getExpiration(),
      sameSite: "Strict",
    });
  }
}
