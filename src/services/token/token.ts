import {Injectable} from '@angular/core';
//import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class Token {

    /**
     * [_token description]
     *
     * @type {string}
     */
    private _token: string = '_token';

    /**
     * Storage provider.
     *
     * @type {Storage}
     */
    private _storage: Storage;

    constructor() {
        //this._storage = new Storage(LocalStorage);
    }

    get(tokenName?) {
        return new Promise((resolve, reject) => {

            tokenName = tokenName || this._token;

            this._storage.get(tokenName).then(token => {
                if (token) {
                    resolve(token);
                }

                resolve(false);
            });
        })
    }

    store(token: string, tokenName?: string): Promise<any> {
        return new Promise((resolve, reject) => {

            tokenName = tokenName || this._token;

            if (token) {
                this._storage.set(tokenName, token);

                resolve(true);
            }

            resolve(false);
        });
    }

    remove(tokenName?: string) {
        tokenName = tokenName || this._token;

        this._storage.remove(tokenName);

        return true;
    }
}
