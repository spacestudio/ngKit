import {Injectable} from '@angular/core';
import {ngKit} from './ngkit';
import {merge} from 'lodash';

@Injectable()
export class ngKitConfig {

    /**
     * Default configuration.
     *
     * @type {Object}
     */
    defaultOptions: Object = {

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
            },
            /**
             * Methods used for authentication.
             */
            method: {
                token: true
            }
        },

        authorization: {},

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

        token: {
            /**
             * Default name of authorization token that is stored.
             */
            name: '_token',
            /**
             * Scheme to use in Authorization header along with token.
             */
            scheme: 'Bearer'
        }
    }

    /**
     * Config options.
     *
     * @type {Object}
     */
    options: Object;

    constructor() {
        this.options = this.defaultOptions;
    }

    /**
     * Return the configurable options.
     *
     * @return {Object}
     */
    getOptions(): Object {
        return this.options;
    }

    /**
     * Get an option by key.
     *
     * @param  {string} key
     * @param  {string} override
     *
     * @return {any}
     */
    get(key: string, override?: any): any {
        if (override) {
            return override;
        }

        if (this.options) {
            return key.split('.').reduce((o, i) => o[i], this.options);
        }
    }

    /**
     * Set the configurable options.
     *
     * @param  {any} options
     *
     * @return {Object}
     */
    setOptions(options: any): Object {
        this.options = merge(this.defaultOptions, options);

        return this.options;
    }
}
