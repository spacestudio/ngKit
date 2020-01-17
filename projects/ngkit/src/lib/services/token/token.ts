import { Injectable } from '@angular/core';
import { CookieStorage } from '../storage/cookie';
import { LocalStorage } from '../storage/local';
import { Config } from '../../config';
import { Crypto } from '../encryption/crypto';
import { CookieState } from '../state/cookie-state.service';

@Injectable()
export class Token {
  /**
   * Create a new instance of the service.
   */
  constructor(
    public config: Config,
    private cookieState: CookieState,
    public localStorage: LocalStorage,
    private crypto: Crypto,
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
    this.tokens.forEach((v, k) => {
      this.remove(k);
    });

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
  }

  /**
   * Get the token from local storage.
   */
  async get(tokenName?: string): Promise<any> {
    await this.load;
    tokenName = tokenName || this.config.get('token.name', this._token);

    if (this.tokens.has(tokenName)) {
      return this.tokens.get(tokenName);
    }

    try {
      let token = await this.localStorage.get(tokenName);

      if (!token) {
        return;
      }

      if (token instanceof ArrayBuffer === false) {
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
        this.cookieState.remove(key);
      }
    });

    this.cookieState.remove(Token.storageKey);
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
    await this.tokens.delete(tokenName);

    return true;
  }

  /**
   * Read a token from a response object.
   */
  read(response: any = null): string {
    if (response) {
      let key = this.config.get('token.readAs');

      return key.split('.').reduce((o: any, i: string) => o[i], response);
    }

    return null;
  }

  /**
   * Store the token in local storage.
   */
  async set(token: any, tokenName?: string): Promise<any> {
    await this.load;
    tokenName = tokenName || this.config.get('token.name', this._token);

    if (token) {
      try {
        this.tokens.set(tokenName, token);
        const encryptedToken = await this.crypto.encrypt(token);
        await this.localStorage.set(tokenName, encryptedToken);

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
