import { Injectable } from '@angular/core';
import { Storage } from './storage';
import { Config } from './../config';

@Injectable()
export class Token {
    /**
     * Name of token stored in local storage.
     *
     * @type {string}
     */
    protected _token: string = '_token';

    /**
     * Constructor.
     *
     * @param  {Config} config
     * @param  {Storage} storage
     */
    constructor(
        public config: Config,
        private storage: Storage
    ) { }

    /**
     * Get the token from local storage.
     *
     * @param  {string} tokenName
     * @return {Promise}
     */
    get(tokenName?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            tokenName = tokenName || this.config.get('token.name', this._token);

            this.storage.get(tokenName).then(token => {
                resolve(token);
            }, err => reject(err));
        });
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
                this.storage.set(tokenName, token).then(() => {
                    resolve(true);
                }, () => reject('Error: Could not store token.'));
            } else {
                reject('Error: No token provided.');
            }
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

        this.storage.remove(tokenName);

        return true;
    }

    /**
     * Read a token from a response object.
     *
     * @param  {Object} response
     * @return {string}
     */
    read(response: any = null): string {
        if (response) {
            let key = this.config.get('token.readAs');

            return key.split('.').reduce((o: any, i: string) => o[i], response);
        }

        return null;
    }
}
