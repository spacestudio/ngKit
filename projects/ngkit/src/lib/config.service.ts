import { Inject, Injectable, Optional } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class ConfigSerivce {
  /**
   * Default configuration.
   */
  static defaultOptions: any = {
    /**
     * Authentication settings.
     */
    authentication: {
      /**
       * Driver used for authentication.
       */
      driver: "session",

      /**
       * Common endpoints for authentication sercice.
       */
      endpoints: {
        check: "",
        forogotPassword: "",
        getUser: "",
        login: "",
        logout: "",
        refresh: "",
        register: "",
        resetPassword: "",
      },

      /**
       * If the authentication service should remember the user after the
       * session expires.
       */
      shouldRemember: true,
    },

    /**
     * Authorization options.
     */
    authorization: {},

    /**
     * Cookie storage options.
     */
    cookies: {
      internalKeys: ["_ngkstate", "_ngktk"],
      path: "/",
      sameSite: "Strict",
      secure: true,
    },

    /**
     * Http options.
     */
    http: {
      /**
       * Based url for http requests.
       */
      baseUrl: "",

      /**
       * Default headers for http request.
       */
      headers: {},
    },

    /**
     * Storage Options
     */
    storage: {
      name: "ngkitStorage",
    },

    /**
     * Token options.
     */
    token: {
      /**
       * Default name of access token read from responses.
       */
      access: "access_token",

      /**
       * The time in seconds until the access token expires.
       */
      expires_in: "expires_in",

      /**
       * Default name of refrehs token read from responses.
       */
      refresh: "refresh_token",

      /**
       * Enables token rotation from web storage to cookie storage at end of session.
       */
      rotateCookies: false,

      /**
       * Default name of authorization token that is stored.
       */
      storeAs: "_token",

      /**
       * Scheme to use in Authorization header along with token.
       */
      scheme: "Bearer",
    },

    /**
     * Cache service options.
     */
    cache: {
      /**
       * Default expiration time in minutes.
       */
      expires: 300,
    },

    /**
     * Enable debug mode.
     */
    debug: false,
  };

  /**
   * Config options.
   */
  options: any;

  /**
   * Create a new instance of the service..
   */
  constructor(@Inject("ngKitOptions") @Optional() private _options: any) {
    this.options = ConfigSerivce.defaultOptions;
    this.setOptions(this._options);
  }

  /**
   * Return the configurable options.
   */
  getOptions(): any {
    return this.options;
  }

  /**
   * Get an option by key.
   */
  get(key: string, override: any = false): any {
    return ConfigSerivce.getItem(key, override);
  }

  /**
   * Static method to get an option by key.
   */
  static getItem(key: string, override?: any): any {
    if (override) {
      return override;
    }

    if (ConfigSerivce.defaultOptions) {
      return key
        .split(".")
        .reduce((o, i) => o[i], ConfigSerivce.defaultOptions);
    }
  }

  /**
   * Merge provided options with the default options.
   */
  mergeOptions(target: any, ...options: any[]): any {
    if (!options.length) {
      return target;
    }

    const option = options.shift();

    if (this.optionIsObject(target) && this.optionIsObject(option)) {
      for (const key in option) {
        if (this.optionIsObject(option[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          } else {
            target[key] = Object.assign({}, target[key]);
          }
          this.mergeOptions(target[key], option[key]);
        } else {
          Object.assign(target, { [key]: option[key] });
        }
      }
    }

    return this.mergeOptions(target, ...options);
  }

  /**
   * Check if an option is an object.
   */
  private optionIsObject(option: any) {
    return option && typeof option === "object" && !Array.isArray(option);
  }

  /**
   * Set an option by key.
   */
  set(key: string, value: any): any {
    const path = key.split(".");
    let modifier = this.options;

    while (path.length > 1) {
      modifier = modifier[path.shift()];
    }

    modifier[path.shift()] = value;

    return this.options;
  }

  /**
   * Set the configurable options.
   */
  setOptions(options: any): ConfigSerivce {
    this.mergeOptions(this.options, options);

    return this.options;
  }
}
