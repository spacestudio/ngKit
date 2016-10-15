import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable()
export class Config {
    /**
     * Default configuration.
     *
     * @type {any}
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
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
     *
     * @type {any}
     */
    options: any;

    /**
     * Constructor.
     */
    constructor() {
        this.options = Config.defaultOptions;
    }

    /**
     * Return the configurable options.
     *
     * @return {any}
     */
    getOptions(): any { return this.options; }

    /**
     * Get an option by key.
     *
     * @param  {string} key
     * @param  {string} override
     * @return {any}
     */
    get(key: string, override: any = false): any {
        return Config.getItem(key, override)
    }

    /**
     * Static method to get an option by key.
     *
     * @param  {string} key
     * @param  {string} override
     * @return {void}
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
     * Set the configurable options.
     *
     * @param  {any} options
     * @return {Config}
     */
    setOptions(options: any): Config {
        this.options = _.merge(this.options, options);

        return this;
    }
}
