import { HttpClient } from '@angular/common/http';
import { Http } from './http';
import { Authorization } from './authorization';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/index';
import { Config } from './../config';
import { Token } from './token';
import { Event } from './event';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

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
    authenticated: boolean;

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
     * Create a new instance of the service.
     *
     * @param  {Authorization} authorization
     * @param  {Config} config
     * @param  {Event} event
     * @param  {HttpClient} http
     * @param  {Http} httpService
     * @param  {Token} token
     */
    constructor(
        public authorization: Authorization,
        public config: Config,
        public event: Event,
        public http: HttpClient,
        public httpService: Http,
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
    check(force: boolean = false): Observable<boolean> {
        let endpoint = this.config.get('authentication.endpoints.check');

        this.event.broadcast('auth:check');

        return new Observable(observer => {
            if (this.authenticated === false) {
                this.checkResolve(observer, false);
            } else if (this.authenticated === true && !force) {
                this.event.broadcast('auth:loggedIn', this.user());
                this.checkResolve(observer, true);
            } else {
                this.httpService.tokenHeader().then((token) => {
                    if (token) {
                        this.getUser(endpoint).then((res) => {
                            this.setAuthenticated(true);
                            this.setUser(res.data || res);
                            this.event.broadcast('auth:loggedIn', this.user());
                            this.checkResolve(observer, true);
                        }, () => {
                            this.setAuthenticated(false);
                            this.event.broadcast('auth:required', true);
                            this.checkResolve(observer, false);
                        });
                    } else {
                        this.setAuthenticated(false);
                        this.checkResolve(observer, false);
                    }
                }, err => observer.error(err));
            }
        });
    }

    /**
     * Resolve the auth check.
     *
     * @param {Function} resolve
     * @param {boolean} authenticated
     */
    checkResolve(observer: Observer<boolean>, authenticated: boolean): void {
        this.event.broadcast('auth:check', authenticated).then(() => {
            setTimeout(() => observer.next(authenticated), 100);
        });
    }

    /**
     * The service event listeners.
     *
     * @return {void}
     */
    eventListeners(): void {
        this.event.listen('auth:loggedIn').subscribe((user) => {
            this.setAuthenticated(true);
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
            return this.http.post(endpoint, data, headers).toPromise()
                .then(res => resolve(res), error => reject(error));
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
            this.token.get().then(token => resolve(token), err => reject(err));
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
     * Get the value authenticated value.
     *
     * @return {boolean}
     */
    getAuthenticated(): boolean {
        return this.authenticated;
    }

    /**
     * Set if authenticated value.
     *
     * @return {boolean}
     */
    setAuthenticated(value: boolean): boolean {
        return this.authenticated = value;
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
                    this.onLogin(res).then(() => resolve(res), error => reject(error));
                }, error => reject(error));
        });
    }

    /**
     * Send a request to log the authenticated user out.
     *
     * @return {Promise<any>}
     */
    logout(endpoint: string = '', headers = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.event.broadcast('auth:loggingOut').then(() => {
                endpoint = this.config.get('authentication.endpoints.logout', endpoint);

                if (endpoint) {
                    this.http.post(endpoint, {}, headers).toPromise().then(res => {
                        this.onLogout();
                        resolve(res)
                    }, error => reject(error));
                } else {
                    this.onLogout();
                    resolve();
                }
            });
        });
    }

    /**
     * Actions to perform on login.
     *
     * @param  {object} res
     * @return {Promise<any>}
     */
    onLogin(res: object): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storeToken(res).then(() => {
                this.event.broadcast('auth:loggingIn', res).then(() => {
                    this.resolveUser().then(() => resolve(), err => reject(err));
                }, err => reject(err));
            }, err => reject(err));
        });
    }

    /**
     * Actions to perform on logout.
     */
    onLogout(): void {
        this.unauthenticate();
        this.event.broadcast('auth:loggedOut');
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
    register(data: object, endpoint: string = '', headers = {}): Promise<any> {
        endpoint = this.config.get('authentication.endpoints.register', endpoint);

        return new Promise((resolve, reject) => {
            this.http.post(endpoint, data, headers).toPromise().then(res => {
                this.onLogin(res).then(() => {
                    resolve(res);

                    this.event.broadcast('auth:registered', res);
                }, error => reject(error));
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
            this.http.post(endpoint, data, headers).toPromise().then(res => {
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
                    this.setAuthenticated(true);

                    this.setUser(user.data || user).then((user) => {
                        this.event.broadcast('auth:loggedIn', user);

                        resolve();
                    }, error => reject(error));
                }, error => reject(error));
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
     * @param  {object} user
     * @return {any}
     */
    setUser(user: object): Promise<any> {
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
            this.token.set(this.token.read(res)).then(() => {
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
        this.setAuthenticated(false);
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
