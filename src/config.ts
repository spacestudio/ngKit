import { Inject, Injectable } from '@angular/core';
import * as _ from 'lodash';

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
     *
     * @param   key
     * @param   override
     */
    get(key: string, override: any = false): any {
        return Config.getItem(key, override)
    }

    /**
     * Static method to get an option by key.
     *
     * @param   key
     * @param   override
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
     * Set an option by key.
     *
     * @param   key
     * @param  value
     */
    setItem(key: string, value: any): any {
        return _.set(this.options, key, value);
    }

    /**
     * Set the configurable options.
     *
     * @param  options
     */
    setOptions(options: any): Config {
        this.options = _.merge(this.options, options);

        return this;
    }
}
