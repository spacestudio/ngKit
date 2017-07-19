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
        'auth:guarded',
        'auth:registered',
    ];

    /**
     * The redirect data on the service.
     *
     * @type {any}
     */
    private redirect: any = null

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
        this.event.setChannels(this.channels);
        this.eventListeners();
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
                resolve(false);
            } else if (Authentication.authenticated === true && !force) {
                this.event.broadcast('auth:loggedIn', this.user());

                resolve(true);
            } else {
                this.token.get().then((token) => {
                    if (token) {
                        this.getUser(endpoint).then((res) => {
                            this.isAuthenticated(true);
                            this.setUser(res.data || res);
                            this.event.broadcast('auth:loggedIn', this.user());

                            resolve(true);
                        }, () => {
                            this.event.broadcast('auth:required', true);
                            this.isAuthenticated(false);
                            resolve(false);
                        });
                    } else {
                        resolve(false);
                        this.isAuthenticated(false);
                    }
                });
            }
        });
    }

    /**
     * The service event listeners.
     *
     * @return {void}
     */
    eventListeners(): void {
        this.event.listen('auth:loggedIn').subscribe((user) => {
            this.isAuthenticated(true);
            this.setUser(user);
        });
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
            return this.http.post(endpoint, data, headers).first()
                .subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Returns the redirect data.
     *
     * @return {any}
     */
    getRedirect(): any {
        return this.redirect;
    }

    /**
     * Get the authentication token.
     *
     * @return {Promise}
     */
    getToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.token.get().then(token => resolve(token));
        });
    }

    /**
     * Get the current authenticated user.
     *
     * @param  {string} endpoint
     * @return {Promise<any>}
     */
    getUser(endpoint: string = ''): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.getUser', endpoint);

        return this.http.get(endpoint).toPromise();
    }

    /**
     * Set if a user is authenticated.
     *
     * @return {boolean}
     */
    isAuthenticated(value: boolean): boolean {
        return Authentication.authenticated = value;
    }

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
            this.http.post(endpoint, credentials, headers).toPromise()
                .then(res => {
                    this.onLogin(res).then(() => resolve(res), error => { });
                }, error => reject(error));
        });
    }

    /**
     * Send a request to log the authenticated user out.
     *
     * @return {boolean}
     */
    logout(endpoint: string = '', headers = {}) {
        this.event.broadcast('auth:loggingOut');

        endpoint = this.config.get('authentication.endpoints.logout', endpoint);

        return new Promise((resolve, reject) => {
            if (endpoint) {
                this.http.post(endpoint, {}, headers).first()
                    .subscribe(res => resolve(res), error => reject(error));
            } else {
                resolve();
            }

            this.unauthenticate();
            this.event.broadcast('auth:loggedOut', this.user());
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
                    this.resolveUser().then(() => resolve());
                });
            });
        });
    }

    /**
     * Returns and clears the redirect data.
     *
     * @return {any}
     */
    pullRedirect(): any {
        let redirect = this.redirect;

        this.redirect = null;

        return redirect;
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
            this.http.post(endpoint, data, headers).first().subscribe(res => {
                this.onLogin(res).then(() => {
                    resolve(res);

                    this.event.broadcast('auth:registered', res);
                }, error => { });
            }, error => reject(error));;
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
            this.http.post(endpoint, data, headers).first()
                .subscribe(res => {
                    this.onLogin(res).then(() => resolve(res))
                }, error => reject(error));
        });
    }

    /**
     * Resolve the authenticated user.
     *
     * @return {Promise<any>}
     */
    resolveUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.getUser().then((user) => {
                    this.isAuthenticated(true);

                    this.setUser(user.data || user).then((user) => {
                        this.event.broadcast('auth:loggedIn', user);

                        resolve();
                    }, error => { });
                }, error => { });
            }, 250);
        });
    }

    /**
     * Set the redirect data.
     *
     * @return {any}
     */
    setRedirect(value: any): any {
        return this.redirect = value;
    }

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
     * Unauthenticate the current user.
     *
     * @return {void}
     */
    unauthenticate(): void {
        this.token.remove();
        this.isAuthenticated(false);
        this.setUser(null);
        this.authorization.clearPolicies();
    }

    /**
     * Get the current authenticated user.
     *
     * @return {any}
     */
    user = (): any => this.authUser;
}
