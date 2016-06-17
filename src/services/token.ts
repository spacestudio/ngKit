import {Injectable} from '@angular/core';
import {Config} from './../config';

@Injectable()
export class Token {

    /**
     * Name of token stored in local storage.
     *
     * @type {string}
     */
    protected _token: string = '_token';

    /**
     * Storage provider.
     *
     * @type {localStorage}
     */
    private _storage: any;

    constructor(public config: Config) {
        this._storage = localStorage;
    }

    /**
     * Get the token from local storage.
     * @param  {string} tokenName
     * @return {Promise}
     */
    get(tokenName?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            tokenName = tokenName || this.config.get('token.name', this._token);

            let token = this._storage.getItem(tokenName);

            if (token) {
                resolve(token);
            } else {
                reject('No token found.');
            }
        })
    }

    /**
     * Store the token in local storage.
     *
     * @param  {string} token
     * @param  {string} tokenName
     * @return {Promise}
     */
    set(token: string, tokenName?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            tokenName = tokenName || this.config.get('token.name', this._token);

            if (token) {
                this._storage.setItem(tokenName, token);

                resolve(true);
            }

            reject('Please enter a token to store.');
        });
    }

    /**
     * Remove token from local storage.
     *
     * @param  {string}  tokenName
     * @return {boolean}
     */
    remove(tokenName?: string): boolean {
        tokenName = tokenName || this.config.get('token.name', this._token);

        this._storage.remove(tokenName);

        return true;
    }
}
