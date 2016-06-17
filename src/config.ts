import {Injectable} from '@angular/core';
import {ngKit} from './ngkit';

@Injectable()
export class Config {

    /**
     * Default configuration.
     *
     * @type {Object}
     */
    defaultOptions: Object = {

        authentication: {
            endpoints: {}
        },
        authorization: {},
        http: {
            baseUrl: '',
        },
        rest: {
            baseUrl: '',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        },
        token: {}
    }

    /**
     * Config options.
     *
     * @type {Object}
     */
    options: Object;

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
     *
     * @return {any}
     */
    getOption(key: string): any {
        return key.split('.').reduce((o, i) => o[i], this.options);
    }

    /**
     * Set the configurable options.
     *
     * @param  {any} options
     *
     * @return {Object}
     */
    setOptions(options: any): Object {
        this.options = Object.assign(this.defaultOptions, options);

        return this.options;
    }
}
