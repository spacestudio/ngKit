import { ConfigSerivce } from '../../config.service';
import { CryptoService } from '../encryption/crypto.service';
import { EventService } from '../event.service';
import { CookieState } from '../state/cookie-state.service';
import { IDBStorageService } from '../storage/idb-storage.service';
import { SessionStorageService } from '../storage/session-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class TokenService {
  /**
   * Create a new instance of the service.
   */
  constructor(
    public config: ConfigSerivce,
    private cookieState: CookieState,
    private crypto: CryptoService,
    private eventService: EventService,
    public idbStoragService: IDBStorageService,
    public sessionStorageService: SessionStorageService
  ) {
    this.init();
  }

  /**
   * Name of token stored in local storage.
   */
  protected _token: string = "_token";

  /**
   * The intialized state of the service.
   */
  initialized: boolean;

  /**
   * The load promise.
   */
  load: Promise<void>;

  /**
   * The storage key to use for tokens.
   */
  static storageKey = "_ngktk";

  /**
   * The tokens that have been loaded in-memory.
   */
  protected tokens: Map<string, string> = new Map();

  /**
   * Destroy the resources of the service.
   */
  async destroy(): Promise<void> {
    this.tokens.forEach((v, k) => this.remove(k));

    if (this.crypto.canEncrypt()) {
      await this.crypto.destroy();
    }
  }

  /**
   * Drop off the tokens into cookies that can be picked up later.
   */
  protected async dropOffTokens(): Promise<void> {
    const tokenKeys = Array.from(this.tokens.keys());
    let keys: any = JSON.stringify(tokenKeys);
    keys =
      typeof Buffer !== "undefined"
        ? Buffer.from(keys, "utf8").toString("base64")
        : btoa(keys);

    await this.cookieState.set(TokenService.storageKey, keys);

    tokenKeys.forEach(async (key) => {
      await this.cookieState.set(key, this.tokens.get(key));
    });
  }

  /**
   * The event listeners of the service.
   */
  async eventListeners(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    if (this.shouldRotateTokensWithCookies()) {
      window.addEventListener("beforeunload", async () => {
        if (await this.idbStoragService.get("logged_in")) {
          this.dropOffTokens();
        }
      });
    }

    window.addEventListener("storage", (event) =>
      this.handleSessionStorageEvent(event)
    );
  }

  /**
   * Get the token from storage.
   */
  async get(tokenName?: string): Promise<any> {
    await this.load;
    tokenName = tokenName || this.config.get("token.name", this._token);

    if (this.tokens.has(tokenName)) {
      return this.tokens.get(tokenName);
    }

    try {
      let token = await this.retrieveToken(tokenName);

      if (!token) {
        return;
      }

      if (typeof token === "string") {
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
   */
  async handleSessionStorageEvent(event: StorageEvent): Promise<void> {
    let data;

    if (event.key === "_ngktkSetSession") {
      if ((data = JSON.parse(event.newValue)) && data?.key && data?.value) {
        await this.sessionStorageService.set(data.key, data.value);
        const token = new Uint8Array(
          [...atob(data.value)].map((char) => char.charCodeAt(0))
        );
        await this.tokens.set(data.key, await this.crypto.decrypt(token));
        this.eventService.broadcast("auth:updated");
      }
    } else if (event.key === "_ngktkRemoveSession" && event.newValue) {
      if ((data = JSON.parse(event.newValue)) && data?.key) {
        await this.sessionStorageService.remove(data.key);
      }
    } else if (event.key === "_ngktkGetSession" && event.newValue) {
      this.tokens.forEach(async (value, key) => {
        if ((value = await this.sessionStorageService.get(key))) {
          localStorage.setItem(
            "_ngktkSetSession",
            JSON.stringify({ key: key, value: value })
          );
          localStorage.removeItem("_ngktkSetSession");
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
    let keys = await this.cookieState.get(TokenService.storageKey);
    keys = keys
      ? JSON.parse(
          typeof Buffer !== "undefined"
            ? Buffer.from(keys, "base64").toString("utf8")
            : atob(keys)
        )
      : null;

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

    await this.cookieState.remove(TokenService.storageKey);
  }

  /**
   * Remove token from local storage.
   */
  async remove(tokenName?: string): Promise<boolean> {
    await this.load;
    tokenName = tokenName || this.config.get("token.name", this._token);
    await this.cookieState.remove(tokenName);
    await this.cookieState.remove(TokenService.storageKey);
    await this.idbStoragService.remove(tokenName);
    await this.sessionStorageService.remove(tokenName);
    await this.tokens.delete(tokenName);
    window.localStorage.setItem(
      "_ngktkRemoveSession",
      JSON.stringify({ key: tokenName })
    );
    window.localStorage.removeItem("_ngktkRemoveSession");

    return true;
  }

  /**
   * Read a token from a response object.
   */
  read(response: any = null, key: string = null): string {
    if (response) {
      let tokenKey = this.config.get("token.access", key);

      return tokenKey.split(".").reduce((o: any, i: string) => o[i], response);
    }

    return null;
  }

  /**
   * Request token from another browser source.
   */
  private async requestSessionTokenForOthersource(): Promise<void> {
    return new Promise((resolve) => {
      window.localStorage.setItem("_ngktkGetSession", `${Date.now()}`);
      window.localStorage.removeItem("_ngktkGetSession");
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

    if ((token = await this.idbStoragService.get(tokenName))) {
      return token;
    }

    if (window?.localStorage) {
      await this.requestSessionTokenForOthersource();
    }

    if ((token = await this.sessionStorageService.get(tokenName))) {
      return new Uint8Array([...atob(token)].map((char) => char.charCodeAt(0)));
    }
  }

  /**
   * Store the token in local storage.
   */
  async set(
    token: any,
    tokenName?: string,
    storageType: string = "local"
  ): Promise<any> {
    await this.load;
    tokenName = tokenName || this.config.get("token.name", this._token);

    if (!token) {
      throw new Error("Error: No token provided.");
    }

    try {
      this.tokens.set(tokenName, token);
      let tokenValue = token;

      if (this.crypto.canEncrypt()) {
        tokenValue = await this.crypto.encrypt(token);
      }

      if (storageType === "local") {
        await this.idbStoragService.set(tokenName, tokenValue);
      } else if (storageType === "session") {
        const sessionTokenValue = btoa(
          String.fromCharCode(...new Uint8Array(tokenValue))
        );

        await this.sessionStorageService.set(tokenName, sessionTokenValue);

        localStorage.setItem(
          "_ngktkSetSession",
          JSON.stringify({ key: tokenName, value: sessionTokenValue })
        );

        localStorage.removeItem("_ngktkSetSession");
      }

      return true;
    } catch (error) {
      console.error(error);
      throw new Error("Error: Could not store token.");
    }
  }

  /**
   * Determine if in memory tokens should be stored in cookies
   * in plain-text before the window is closed so they may be
   * retrieved later.
   */
  shouldRotateTokensWithCookies(): boolean {
    return this.config.get("token.rotateCookies");
  }
}
