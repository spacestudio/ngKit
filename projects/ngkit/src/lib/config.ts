import { Inject, Injectable } from '@angular/core';

@Injectable()
export class Config {
  /**
   * Default configuration.
   */
  static defaultOptions: any = {
    /**
     * Authentication settings.
     */
    authentication: {
      /**
       * Common endpoints for authentication sercice.
       */
      endpoints: {
        check: '',
        forogotPassword: '',
        getUser: '',
        login: '',
        logout: '',
        register: '',
        resetPassword: '',
        socialAuth: ''
      },
      /**
       * Methods used for authentication.
       */
      method: {
        token: true
      },
      /**
       * Social provider configuration.
       */
      social: {
        facebook: {
          id: '',
          version: 'v2.6',
          xfbml: true,
          scope: 'public_profile,email'
        },
        twitter: {
          id: ''
        },
        redirectTo: '',
        oauthProxy: ''
      }
    },
    /**
     * Authorization options.
     */
    authorization: {},
    /**
     * Http options.
     */
    http: {
      /**
       * Based url for http requests.
       */
      baseUrl: '',
      /**
       * Default headers for http request.
       */
      headers: {}
    },
    /**
     * Storage Options
     */
    storage: {
      name: 'ngkitStorage'
    },
    /**
     * Token options.
     */
    token: {
      /**
       * Default name of authorization token read from responses.
       */
      readAs: 'token',
      /**
       * Default name of authorization token that is stored.
       */
      storeAs: '_token',
      /**
       * Scheme to use in Authorization header along with token.
       */
      scheme: 'Bearer'
    },
    /**
     * Cache service options.
     */
    cache: {
      /**
       * Default expiration time in minutes.
       */
      expires: 5
    },
    /**
     * Enable debug mode.
     */
    debug: false
  }

  /**
   * Config options.
   */
  options: any;

  /**
   * Create a new instance of the service..
   */
  constructor(@Inject('ngKitOptions') private _options: any) {
    this.options = Config.defaultOptions;
    this.setOptions(this._options);
  }

  /**
   * Return the configurable options.
   */
  getOptions(): any { return this.options; }

  /**
   * Get an option by key.
   */
  get(key: string, override: any = false): any {
    return Config.getItem(key, override)
  }

  /**
   * Static method to get an option by key.
   */
  static getItem(key: string, override?: any): any {
    if (override) {
      return override;
    }

    if (Config.defaultOptions) {
      return key.split('.').reduce((o, i) => o[i], Config.defaultOptions);
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
            target[key] = Object.assign({}, target[key])
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
    return (option && typeof option === 'object' && !Array.isArray(option));
  }

  /**
   * Set an option by key.
   */
  setItem(key: string, value: any): any {
    const path = key.split(".");
    let modifier = this.options;

    while (path.length > 1) {
      modifier = modifier[path.shift()];
    }

    modifier[path.shift()] = value;

    return this.options
  }

  /**
   * Set the configurable options.
   */
  setOptions(options: any): Config {
    this.mergeOptions(this.options, options);

    return this.options;
  }
}
