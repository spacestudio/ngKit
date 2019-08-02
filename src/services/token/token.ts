import { Injectable } from '@angular/core';
import { CookieStorage } from '../storage/cookie';
import { LocalStorage } from '../storage/local';
import { Config } from '../../config';
import { Crypto } from '../encryption/crypto';

@Injectable()
export class Token {
    /**
     * Constructor.
     */
    constructor(
        public config: Config,
        private cookieStorage: CookieStorage,
        private localStorage: LocalStorage,
        private crypto: Crypto,
    ) { }

    /**
    * Name of token stored in local storage.
    */
    protected _token: string = '_token';

    /**
     * Get the token from local storage.
     */
    async get(tokenName?: string): Promise<any> {
        tokenName = tokenName || this.config.get('token.name', this._token);

        try {
            let token = await this.cookieStorage.get(tokenName);

            if (token) {
                return token;
            }

            const encrytpedToken = await this.localStorage.get(tokenName);

            return await this.crypto.decrypt(encrytpedToken);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Remove token from local storage.
     */
    remove(tokenName?: string): boolean {
        tokenName = tokenName || this.config.get('token.name', this._token);
        this.cookieStorage.remove(tokenName);
        this.localStorage.remove(tokenName);

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
                const encryptedToken = await this.crypto.encrypt(token);
                await this.localStorage.set(tokenName, encryptedToken);
                await this.cookieStorage.set(tokenName, token);

                return true;
            } catch (error) {
                throw new Error('Error: Could not store token.');
            }
        } else {
            throw new Error('Error: No token provided.');
        }
    }
}
