import { HttpClient } from './http-client';
import { Token } from './token';
import { RestClient } from './rest-client';
import { ngKit } from './../ngkit';
export declare class Authentication {
    private token;
    private http;
    private rest;
    private ngKit;
    /**
     * Storage provider.
     *
     * @type {localStorage}
     */
    private _storage;
    /**
     * Authorized user.
     *
     * @type {object}
     */
    private _user;
    test: any;
    /**
     * Constructor
     */
    constructor(token: Token, http: HttpClient, rest: RestClient, ngKit: ngKit);
    /**
     * Send a login request.
     *
     * @param  {string} endpoint
     * @param  {object} credentials
     * @return {Promise}
     */
    login(endpoint: string, credentials: any): Promise<any>;
    /**
     * Log user out
     * @return {boolean}
     */
    logout(): boolean;
    /**
     * Send a forgot password request.
     *
     * @param  {string} endpoint
     * @param  {object}  credentials
     * @return {Promise}
     */
    forgotPassword(endpoint: string, credentials: any): Promise<any>;
    /**
     * Send a register request.
     *
     * @param  {object} data
     * @return {Promise}
     */
    register(data: any): Promise<any>;
    /**
     * Check if user is logged in.
     *
     * @return {Promise}
     */
    check(): Promise<boolean>;
    /**
     * Log user out and redirect.
     *
     * @param {object} error
     * @return {void}
     */
    reject(error: any): void;
    /**
     * Get the current authenticated user.
     *
     * @return {object}
     */
    user(): any;
    /**
     * Set the current authenticated user.
     *
     * @return {void}
     */
    setUser(user: any): void;
    /**
     * Get the current authenticated user.
     *
     * @return {object}
     */
    getUser(endpoint: string): Promise<any>;
    /**
     * Store auth token in local storage.
     *
     * @param  {string} token
     * @return {Promise}
     */
    storeToken(token: any, tokenName?: string): Promise<any>;
    /**
     * Get the authorization token from local storage.
     *
     * @return {Promise}
     */
    getToken(tokenName?: string): Promise<any>;
    /**
     * Remove the token from local storage.
     *
     * @return {boolean}
     */
    removeToken(tokenName?: any): boolean;
}
