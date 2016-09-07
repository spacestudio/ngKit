import { Authorization } from './authorization';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserModel } from '../models/index';
import { Config } from './../config';
import { Http } from './http';
import { Token } from './token';
import { Event } from './event';

@Injectable()
export class Authentication {
    /**
     * Storage provider.
     *
     * @type {localStorage}
     */
    storage: any;

    /**
     * Authorized user.
     *
     * @type {object}
     */
    authUser: any = null;

    /**
     * State of the user authentication.
     *
     * @type {boolean}
     */
    static authenticated: boolean = null;

    /**
     * Event channels.
     *
     * @type {Array}
     */
    protected channels: string[] = [
        'auth:login',
        'auth:logginIn',
        'auth:loggedIn',
        'auth:logout',
        'auth:loggingOut',
        'auth:loggedOut',
        'auth:required',
        'auth:check',
        'auth:guarded'
    ];

    /**
     * Constructor.
     */
    constructor(
        public authorization: Authorization,
        public config: Config,
        public event: Event,
        public http: Http,
        public token: Token
    ) {
        this.storage = localStorage;
        this.init();
        this.event.setChannels(this.channels);
        this.eventListeners();
    }

    /**
     * Code to call on init.
     *
     * @return {void}
     */
    init() { };

    /**
     * Send a login request.
     *
     * @param  {object} credentials
     * @param  {string} endpoint
     * @param  {object} headers
     * @return {Promise}
     */
    login(credentials: any, endpoint: string = '', headers = {}): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.login', endpoint);

        return new Promise((resolve, reject) => {
            this.http.post(endpoint, credentials, headers).subscribe(res => {
                this.onLogin(res).then(() => resolve(res));
            }, error => reject(error));
        });
    }

    /**
     * Actions to perform on login.
     *
     * @param  {object} res
     * @return {Promise<any>}
     */
    onLogin(res): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storeToken(res).then(() => {
                this.event.broadcast('auth:loggingIn', res).then(() => {
                    this.getUser().then((user) => {
                        this.isAuthenticated(true);
                        this.setUser(user.data || user).then((user) => {
                            this.event.broadcast('auth:loggedIn', user);
                            resolve(true);
                        });
                    });
                });
            });
        });
    }

    /**
     * Store aut token and broadcast an event.
     *
     * @param  {any} res
     * @return {Promise}
     */
    storeToken(res: any): Promise<any> {
        return new Promise((resolve) => {
            this.token.set(this.token.read(res)).then(stored => {
                resolve(res);
            }, error => console.error(error));
        });
    }

    /**
     * Log user out.
     *
     * @return {boolean}
     */
    logout() {
        this.event.broadcast('auth:loggingOut');
        if (this.token.remove()) {
            this.isAuthenticated(false);
            this.setUser(null);
            this.event.broadcast('auth:loggedOut');
            this.setUser(null);

            return true;
        }

        return false;
    }

    /**
     * Send a forgot password request.
     *
     * @param  {object}  credentials
     * @param  {string} endpoint
     * @param  {object} headers
     * @return {Promise}
     */
    forgotPassword(data: any, endpoint: string = '', headers = {}): Promise<any> {
        endpoint = this.config.get(
            'authentication.endpoints.forgotPassword', endpoint
        );

        return new Promise((resolve, reject) => {
            return this.http.post(endpoint, data, headers).subscribe(
                res => resolve(res), error => reject(error)
            );
        });
    }

    /**
     * Send a reset password request.
     *
     * @param  {object}  credentials
     * @param  {string} endpoint
     * @param  {object} headers
     * @return {Promise}
     */
    resetPassword(data: any, endpoint: string = '', headers = {}): Promise<any> {
        endpoint = this.config.get(
            'authentication.endpoints.resetPassword', endpoint
        );

        return new Promise((resolve, reject) => {
            this.http.post(endpoint, data, headers).subscribe(
                res => this.onLogin(res).then(() => resolve(res)),
                error => reject(error)
            );
        });
    }

    /**
     * Send a register request.
     *
     * @param  {object} data
     * @param  {string} endpoint
     * @param  {object} headers
     * @return {Promise}
     */
    register(data, endpoint: string = '', headers = {}): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.register', endpoint);

        return new Promise((resolve, reject) => {
            this.http.post(endpoint, data, headers).subscribe(res => {
                this.onLogin(res).then(() => resolve(res));
            }, error => reject(error));;
        });
    }

    /**
     * Check if user is logged in.
     *
     * @param  {boolean} force
     * @return {Promise}
     */
    check(force: boolean = false): Promise<boolean> {
        let endpoint = this.config.get('authentication.endpoints.check');

        this.event.broadcast('auth:check');

        return new Promise((resolve, reject) => {
            if (Authentication.authenticated === false) {
                reject(false);
            } else if (Authentication.authenticated === true && !force) {
                resolve(true);
            } else {
                this.token.get().then((token) => {
                    this.getUser(endpoint).then((res) => {
                        this.isAuthenticated(true);
                        this.setUser(res.data || res);
                        resolve(true);
                    }, () => {
                        this.event.broadcast('auth:required', true);
                        reject(false);
                    });
                }, error => reject(false));
            }
        });
    }

    /**
     * Log user out and redirect.
     *
     * @param {object} error
     * @return {void}
     */
    reject(error): void {
        this.event.broadcast('auth:required');
        this.logout();
    }

    /**
     * Get the current authenticated user.
     *
     * @return {any}
     */
    user = (): any => this.authUser;

    /**
     * Set the current authenticated user.
     *
     * @return {any}
     */
    setUser(user): Promise<any> {
        if (user) {
            user = new UserModel(this.authorization, user);
        }

        return new Promise((resolve) => resolve(this.authUser = user));
    }

    /**
     * Get the current authenticated user.
     *
     * @param  {string} endpoint
     * @return {object}
     */
    getUser(endpoint: string = ''): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.getUser', endpoint);

        return new Promise((resolve, reject) => {
            this.http.get(endpoint)
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Get the login details.
     *
     * @return {object}
     */
    getLoginDetails() {
        return new Promise((resolve, reject) => {
            let login_details = this.storage.getItem('login_details');

            if (login_details) {
                login_details = JSON.parse(login_details);
                resolve(login_details);
            } else {
                reject(false);
            }
        });
    }

    /**
     * Update Login details for a user
     *
     * @param {Object} login_details
     * @return {boolean}
     */
    updateLogingDetails(login_details) {
        return new Promise((resolve, reject) => {
            let stored_login_details = this.storage.getItem('login_details');

            stored_login_details = JSON.parse(stored_login_details) || {};
            login_details = Object.assign(stored_login_details, login_details);

            this.storage.setItem('login_details', JSON.stringify(login_details));

            resolve(true);
        });
    }

    /**
     * Set if a user is authenticated.
     *
     * @return {boolean} [description]
     */
    isAuthenticated(value: boolean): boolean {
        return Authentication.authenticated = value;
    }

    /**
     * Service event listeners.
     *
     * @return {void}
     */
    eventListeners(): void {
        this.event.listen('auth:loggedIn').subscribe((user) => {
            this.isAuthenticated(true);
            this.setUser(user);
        });
    }
}
