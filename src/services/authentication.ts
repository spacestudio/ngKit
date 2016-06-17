import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient} from './http-client';
import {Token} from './token';
import {RestClient} from './rest-client';
import {ngKit} from './../ngkit';

@Injectable()
export class Authentication {

    /**
     * Storage provider.
     *
     * @type {localStorage}
     */
    private _storage: any;

    /**
     * Authorized user.
     *
     * @type {object}
     */
    private _user: any;

    test;

    /**
     * Constructor
     */
    constructor(
        private token: Token,
        private http: HttpClient,
        private rest: RestClient,
        private ngKit: ngKit
    ) {
        this._storage = localStorage;

        //this.test = this.ngKit._config;
    }

    /**
     * Send a login request.
     *
     * @param  {string} endpoint
     * @param  {object} credentials
     * @return {Promise}
     */
    login(endpoint: string, credentials: any): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.http.post(endpoint, credentials)
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Log user out
     * @return {boolean}
     */
    logout() {
        if (this.removeToken()) return true

        return false;
    }

    /**
     * Send a forgot password request.
     *
     * @param  {string} endpoint
     * @param  {object}  credentials
     * @return {Promise}
     */
    forgotPassword(endpoint: string, credentials: any): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.http.post(endpoint, credentials)
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Send a register request.
     *
     * @param  {object} data
     * @return {Promise}
     */
    register(data): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.http.post('register', data)
                .subscribe(res => resolve(res), error => reject(error));;
        });
    }

    /**
     * Check if user is logged in.
     *
     * @return {Promise}
     */
    check(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.token.get().then((token) => {
                this.getUser('').then((res) => {
                    this.setUser(res);
                    resolve(true);
                }, () => reject(false));
            }, () => reject(false));
        });
    }

    /**
     * Log user out and redirect.
     *
     * @param {object} error
     * @return {void}
     */
    reject(error): void {
        if (error.status == 401) {
            this.logout();

            // REVIEW: use authorization
            //this._redirect.next(error);
        }
    }

    /**
     * Get the current authenticated user.
     *
     * @return {object}
     */
    user() {
        return this._user;
    }

    /**
     * Set the current authenticated user.
     *
     * @return {void}
     */
    setUser(user): void {
        this._user = user;
    }

    /**
     * Get the current authenticated user.
     *
     * @return {object}
     */
    getUser(endpoint: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.rest.get(endpoint)
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Store auth token in local storage.
     *
     * @param  {string} token
     * @return {Promise}
     */
    storeToken(token, tokenName?: string): Promise<any> {
        return this.token.set(token, tokenName);
    }

    /**
     * Get the authorization token from local storage.
     *
     * @return {Promise}
     */
    getToken(tokenName?: string): Promise<any> {
        return this.token.get(tokenName);
    }

    /**
     * Remove the token from local storage.
     *
     * @return {boolean}
     */
    removeToken(tokenName?) {
        return this.token.remove(tokenName);
    }
}
