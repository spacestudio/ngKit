import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient} from './http-client';
import {Token} from './token';
import {RestClient} from './rest-client';
import {ngKit} from './../ngkit';
import {Config} from './../config';

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

    /**
     * Constructor.
     */
    constructor(
        private token: Token,
        private http: HttpClient,
        private rest: RestClient,
        private ngKit: ngKit,
        private config: Config
    ) {
        this._storage = localStorage;
    }

    /**
     * Send a login request.
     *
     * @param  {object} credentials
     * @param  {string} endpoint
     *
     * @return {Promise}
     */
    login(credentials: any, endpoint: string = ''): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.login', endpoint);

        return new Promise((resolve, reject) => {
            return this.http.post(endpoint, credentials)
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Log user out.
     *
     * @return {boolean}
     */
    logout() {
        if (this.removeToken()) return true

        return false;
    }

    /**
     * Send a forgot password request.
     *
     * @param  {object}  credentials
     * @param  {string} endpoint
     *
     * @return {Promise}
     */
    forgotPassword(credentials: any, endpoint: string): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.forgotPassword', endpoint);

        return new Promise((resolve, reject) => {
            return this.http.post(endpoint, credentials)
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Send a register request.
     *
     * @param  {object} data
     * @param  {string} endpoint
     *
     * @return {Promise}
     */
    register(data, endpoint: string = ''): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.register', endpoint);

        return new Promise((resolve, reject) => {
            return this.http.post(endpoint, data)
                .subscribe(res => resolve(res), error => reject(error));;
        });
    }

    /**
     * Check if user is logged in.
     *
     * @param  {string} endpoint
     *
     * @return {Promise}
     */
    check(endpoint: string = ''): Promise<boolean> {
        endpoint = this.config.get('authentication.endpoints.check', endpoint);

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
     * @param  {string} endpoint
     *
     * @return {object}
     */
    getUser(endpoint: string = ''): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.getUser', endpoint);

        return new Promise((resolve, reject) => {
            this.rest.get(endpoint)
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Store auth token in local storage.
     *
     * @param  {string} token
     *
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
