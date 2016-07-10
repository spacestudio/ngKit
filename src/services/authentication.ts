import { Injectable } from '@angular/core';
import { Config } from './../config';
import { Http } from './http';
import { Token } from './token';
import { Event } from './event';
import { Observable, Subject } from 'rxjs';

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
    authenticated: boolean = null;

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
        public config: Config,
        public event: Event,
        public http: Http,
        public token: Token
    ) {
        this.storage = localStorage;
        this.init();
        this.event.setChannels(this.channels);
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
     * @return {Promise}
     */
    login(credentials: any, endpoint: string = ''): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.login', endpoint);

        return new Promise((resolve, reject) => {
            this.http.post(endpoint, credentials).subscribe(res => {
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
                        this.authenticated = true;
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
            this.authenticated = false;
            this.event.broadcast('auth:loggedOut');
            return true;
        }

        return false;
    }

    /**
     * Send a forgot password request.
     *
     * @param  {object}  credentials
     * @param  {string} endpoint
     * @return {Promise}
     */
    forgotPassword(data: any, endpoint: string = ''): Promise<any> {
        endpoint = this.config.get(
            'authentication.endpoints.forgotPassword', endpoint
        );

        return new Promise((resolve, reject) => {
            return this.http.post(endpoint, data).subscribe(
                res => resolve(res), error => reject(error)
            );
        });
    }

    /**
     * Send a reset password request.
     *
     * @param  {object}  credentials
     * @param  {string} endpoint
     * @return {Promise}
     */
    resetPassword(data: any, endpoint: string = ''): Promise<any> {
        endpoint = this.config.get(
            'authentication.endpoints.resetPassword', endpoint
        );

        return new Promise((resolve, reject) => {
            this.http.post(endpoint, data).subscribe(
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
     * @return {Promise}
     */
    register(data, endpoint: string = ''): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.register', endpoint);

        return new Promise((resolve, reject) => {
            this.http.post(endpoint, data).subscribe(res => {
                this.onLogin(res).then(() => resolve(res));
            }, error => reject(error));;
        });
    }

    /**
     * Check if user is logged in.
     *
     * @param  {string} endpoint
     * @return {Promise}
     */
    check(endpoint: string = ''): Promise<boolean> {
        endpoint = this.config.get('authentication.endpoints.check', endpoint);

        this.event.broadcast('auth:check');

        return new Promise((resolve, reject) => {
            if (this.authenticated === false) {
                resolve(false);
            } else {
                this.token.get().then((token) => {
                    this.getUser(endpoint).then((res) => {
                        this.authenticated = true;
                        this.setUser(res.data || res);
                        resolve(true);
                    }, () => {
                        this.event.broadcast('auth:required', true);
                        reject(false);
                    });
                });
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
}
