import { Injectable } from '@angular/core';
import { LocalStorage } from '../storage/local';
import { Config } from '../../config';
import { Crypto } from '../encryption/crypto';
import { CookieState } from '../state/cookie-state.service';
import { SessionStorage } from '../storage/session';
import { Event } from '../event';

@Injectable({
  providedIn: 'root',
})
export class Token {
  /**
   * Create a new instance of the service.
   */
  constructor(
    public config: Config,
    private cookieState: CookieState,
    private crypto: Crypto,
    private event: Event,
    public localStorage: LocalStorage,
    public sessionStorage: SessionStorage,
  ) {
    this.init();
  }

  /**
  * Name of token stored in local storage.
  */
  protected _token: string = '_token';

  /**
   * The intialized state of the service.
   */
  initialized: boolean;

  /**
   * The load promise.
   */
  load: Promise<any>;

  /**
   * The storage key to use for tokens.
   */
  static storageKey = '_ngktk';

  /**
   * The tokens that have been loaded in-memory.
   */
  protected tokens: Map<string, string> = new Map();

  /**
   * Destroy the resources of the service.
   */
  async destroy(): Promise<void> {
    this.tokens.forEach((v, k) => this.remove(k));
    await this.crypto.destroy();
  }

  /**
   * Drop off the tokens into cookies that can be picked up later.
   */
  protected async dropOffTokens(): Promise<void> {
    const tokenKeys = Array.from(this.tokens.keys());
    let keys: any = JSON.stringify(tokenKeys);
    keys = typeof Buffer !== 'undefined' ?
      Buffer.from(keys, 'utf8').toString('base64') : btoa(keys);

    await this.cookieState.set(Token.storageKey, keys);

    tokenKeys.forEach(async (key) => {
      await this.cookieState.set(key, this.tokens.get(key));
    });
  }

  /**
   * The event listeners of the service.
   */
  async eventListeners(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.shouldRotateTokensWithCookies()) {
      window.addEventListener('beforeunload', async () => {
        if (await this.localStorage.get('logged_in')) {
          this.dropOffTokens();
        }
      });
    }

    window.addEventListener('storage', (event) => this.handleSessionStorageEvent(event));
  }

  /**
   * Get the token from storage.
   */
  async get(tokenName?: string): Promise<any> {
    await this.load;
    tokenName = tokenName || this.config.get('token.name', this._token);

    if (this.tokens.has(tokenName)) {
      return this.tokens.get(tokenName);
    }

    try {
      let token = await this.retrieveToken(tokenName);

      if (!token) {
        return;
      }

      if (typeof token === 'string') {
        return token;
      }

      const decryptedToken = await this.crypto.decrypt(token);
      this.tokens.set(tokenName, decryptedToken);

      return decryptedToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle a storage event to pass session keys.
   *
   * @param event
   */
  async handleSessionStorageEvent(event: StorageEvent): Promise<void> {
    let data;

    if (event.key === '_ngktkSetSession') {
      if ((data = JSON.parse(event.newValue)) && data?.key && data?.value) {
        await this.sessionStorage.set(data.key, data.value);
        const token = new Uint8Array([...atob(data.value)].map(char => char.charCodeAt(0)));
        await this.tokens.set(data.key, await this.crypto.decrypt(token));
        this.event.broadcast('auth:updated');
      }
    } else if (event.key === '_ngktkRemoveSession' && event.newValue) {
      if ((data = JSON.parse(event.newValue)) && data?.key) {
        await this.sessionStorage.remove(data.key);
      }
    } else if (event.key === '_ngktkGetSession' && event.newValue) {
      this.tokens.forEach(async (value, key) => {
        if (value = await this.sessionStorage.get(key)) {
          localStorage.setItem('_ngktkSetSession', JSON.stringify({ key: key, value: value }));
          localStorage.removeItem('_ngktkSetSession');
        }
      });
    }
  }

  /**
   * Initialize the serivce.
   */
  init(): void {
    this.load = new Promise(async (resolve) => {
      if (this.initialized) {
        resolve();
      }

      if (this.shouldRotateTokensWithCookies()) {
        await this.pickUpTokens();
      }

      this.eventListeners();
      this.initialized = true;
      resolve();
    });
  }

  /**
   * Pickup stored tokens in cookies.
   */
  protected async pickUpTokens(): Promise<void> {
    let keys = await this.cookieState.get(Token.storageKey);
    keys = keys ? JSON.parse(typeof Buffer !== 'undefined' ?
      Buffer.from(keys, 'base64').toString('utf8') : atob(keys)) : null;

    if (!keys || !keys.length) {
      return;
    }

    keys.forEach(async (key) => {
      const cookieValue = await this.cookieState.get(key);

      if (cookieValue) {
        this.tokens.set(key, cookieValue);
        await this.cookieState.remove(key);
      }
    });

    await this.cookieState.remove(Token.storageKey);
  }

  /**
   * Remove token from local storage.
   */
  async remove(tokenName?: string): Promise<boolean> {
    await this.load;
    tokenName = tokenName || this.config.get('token.name', this._token);
    await this.cookieState.remove(tokenName);
    await this.cookieState.remove(Token.storageKey);
    await this.localStorage.remove(tokenName);
    await this.sessionStorage.remove(tokenName);
    await this.tokens.delete(tokenName);
    window.localStorage.setItem('_ngktkRemoveSession', JSON.stringify({ key: tokenName }));
    window.localStorage.removeItem('_ngktkRemoveSession');

    return true;
  }

  /**
   * Read a token from a response object.
   */
  read(response: any = null, key: string = null): string {
    if (response) {
      let tokenKey = this.config.get('token.access', key);

      return tokenKey.split('.').reduce((o: any, i: string) => o[i], response);
    }

    return null;
  }

  /**
   * Request token from another browser source.
   */
  private async requestSessionTokenForOthersource(): Promise<ArrayBuffer> {
    return new Promise(resolve => {
      window.localStorage.setItem('_ngktkGetSession', `${Date.now()}`);
      window.localStorage.removeItem('_ngktkGetSession');
      resolve();
    });
  }

  /**
   * Retrieve a token by name from stroage.
   *
   * @param tokenName
   */
  private async retrieveToken(tokenName: string): Promise<ArrayBuffer> {
    let token;

    if (token = await this.localStorage.get(tokenName)) {
      return token;
    }

    if (window?.localStorage) {
      await this.requestSessionTokenForOthersource();
    }

    if (token = await this.sessionStorage.get(tokenName)) {
      return new Uint8Array([...atob(token)].map(char => char.charCodeAt(0)));
    }
  }

  /**
   * Store the token in local storage.
   */
  async set(token: any, tokenName?: string, storageType: string = 'local'): Promise<any> {
    await this.load;
    tokenName = tokenName || this.config.get('token.name', this._token);

    if (token) {
      try {
        this.tokens.set(tokenName, token);

        const encryptedToken = await this.crypto.encrypt(token);

        if (storageType === 'local') {
          await this.localStorage.set(tokenName, encryptedToken);
        } else if (storageType === 'session') {
          const tokenValue = btoa(String.fromCharCode(...new Uint8Array(encryptedToken)));
          await this.sessionStorage.set(tokenName, tokenValue);
          localStorage.setItem('_ngktkSetSession', JSON.stringify({ key: tokenName, value: tokenValue }));
          localStorage.removeItem('_ngktkSetSession');
        }

        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Error: Could not store token.');
      }
    } else {
      throw new Error('Error: No token provided.');
    }
  }

  /**
   * Determine if in memory tokens should be stored in cookies
   * in plain-text before the window is closed so they may be
   * retrieved later.
   */
  shouldRotateTokensWithCookies(): boolean {
    return this.config.get('token.rotateCookies');
  }
}
