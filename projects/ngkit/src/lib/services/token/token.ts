import { Injectable } from '@angular/core';
import { CookieStorage } from '../storage/cookie';
import { LocalStorage } from '../storage/local';
import { Config } from '../../config';
import { Crypto } from '../encryption/crypto';

@Injectable()
export class Token {
  /**
   * Create a new instance of the service.
   */
  constructor(
    public config: Config,
    private cookieStorage: CookieStorage,
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
   * The tokens that have been loaded in-memory.
   */
  protected tokens: Map<string, string> = new Map();

  /**
   * Drop off the tokens into cookies that can be picked up later.
   */
  protected async dropOffTokens(): Promise<void> {
    const keys = Array.from(this.tokens.keys());
    await this.cookieStorage.set('_ngktk', btoa(JSON.stringify(keys)), {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });

    keys.forEach(async (key) => {
      const tokenValue = this.tokens.get(key);
      await this.cookieStorage.set(key, tokenValue, {
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });
    });
  }

  /**
   * The event listeners of the service.
   */
  eventListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.shouldRotateTokensWithCookies()) {
      window.addEventListener('beforeunload', () => {
        this.dropOffTokens();
      });
    }
  }

  /**
   * Get the token from local storage.
   */
  async get(tokenName?: string): Promise<any> {
    tokenName = tokenName || this.config.get('token.name', this._token);

    if (this.tokens.has(tokenName)) {
      return this.tokens.get(tokenName);
    }

    try {
      let token = await this.localStorage.get(tokenName);

      if (!token) {
        return;
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
    if (this.shouldRotateTokensWithCookies()) {
      this.pickUpTokens();
    }

    this.eventListeners();
  }

  /**
   * Pickup stored tokens in cookies.
   */
  protected async pickUpTokens(): Promise<void> {
    let keys = await this.cookieStorage.get('_ngktk');
    keys = keys ? JSON.parse(atob(keys)) : [];

    if (!keys || !keys.length) {
      return;
    }

    keys.forEach(async (key) => {
      const cookieValue = await this.cookieStorage.get(key);

      if (cookieValue) {
        this.tokens.set(key, cookieValue);
        this.cookieStorage.remove(key);
      }
    });

    this.cookieStorage.remove('_ngktk');
  }

  /**
   * Remove token from local storage.
   */
  remove(tokenName?: string): boolean {
    tokenName = tokenName || this.config.get('token.name', this._token);
    this.cookieStorage.remove(tokenName);
    this.localStorage.remove(tokenName);
    this.tokens.delete(tokenName);

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
    tokenName = tokenName || this.config.get('token.name', this._token);

    if (token) {
      try {
        this.tokens.set(tokenName, token);
        const encryptedToken = await this.crypto.encrypt(token);
        await this.localStorage.set(tokenName, encryptedToken);

        return true;
      } catch (error) {
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
