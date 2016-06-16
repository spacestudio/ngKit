import {Injectable, EventEmitter, Output} from '@angular/core';
import {Http} from './../http';
import {Token} from './../token';
import {ApiClient} from './../api-client';

//import {AppConfig} from './config';


//import {Facebook} from './facebook';
//import * as _ from 'lodash';
import {Subject} from 'rxjs/Subject';
//import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class Authentication {

    /**
     * Storage provider.
     *
     * @type {Storage}
     */
    private _storage: Storage;

    /**
     * Redirection event.
     *
     * @type {Subject}
     */
    private _redirect = new Subject<any>();

    /**
     * [asObservable description]
     *
     * @return {[type]} [description]
     */
    redirect$ = this._redirect.asObservable();

    private _user: any;

    /**
     * Constructor
     */
    constructor(
        //private config: AppConfig,
        private token: Token,
        private http: Http
        private api: ApiClient,
        //public facebook: Facebook
    ) {
        //this._storage = new Storage(LocalStorage);
        this.http.baseUrl = 'http://api.babyhandle.dev'
    }

    /**
     * Login via API
     * @param  {object} credentials
     * @return POST /auth/login
     */
    login(credentials) {
        this.updateLogingDetails({ method: 'email_username' });

        return this.http.post('auth/login', credentials);
    }

    /**
     * Login via Facebook
     * @return {promise}
     */
    loginWithFacebook() {
        return new Promise((resolve, reject) => {

            this.facebook.login().then((res) => {

                this.handleFacebookLoginSuccess(res).subscribe((res: any) => {

                    this.storeToken(res.data.token).then(() => {
                        resolve(true);
                    });
                },
                    (error) => {
                        reject(this.handleFacebookLoginError(error));
                    })
            });
        });
    }

    /**
     * Handle succesful facebook login
     * @param  {object} res
     * @return {promise}
     */
    handleFacebookLoginSuccess(res) {
        if (res.status == 'connected') {

            let facebook_credentials = {
                facebook_user_id: res.authResponse.userID,
                facebook_access_token: res.authResponse.accessToken,
                facebook_token_expires: res.authResponse.expiresIn
            };

            this.storeToken(res.authResponse.accessToken, 'facebook_access_token');

            this.updateLogingDetails({ method: 'facebook' });

            return this.http.post('auth/login-facebook', facebook_credentials);
        }
    }

    /**
     * Handle errors on facebook login
     * @param  {object} error
     * @return {[type]}
     */
    handleFacebookLoginError(error) {
        console.log(error);
    }

    /**
     * Log user out
     * @return {boolean}
     */
    logout() {
        if (this.removeToken()) {
            return true
        }

        return false;
    }

    forgotPassword(credentials) {
        return this.http.post('auth/forgot-password', credentials);
    }

    /**
     * Register a new user
     * @param  {object} data
     * @return POST /register
     */
    register(data) {
        this.updateLogingDetails({ method: 'email_username' });

        return this.http.post('register', data);
    }

    /**
     * Store auth token in local storage
     * @param  {string} token
     * @return boolean
     */
    storeToken(token, tokenName?: string) {
        return this.token.store(token, tokenName);
    }

    /**
     * Get the authorization token from local storage
     * @return {mixed}
     */
    getToken(tokenName?) {
        return this.token.get();
    }

    /**
     * Remove the token from local storage
     * @return {boolean}
     */
    removeToken(tokenName?) {
        return this.token.remove();
    }

    /**
     * Get the login details
     * @return {object}
     */
    getLoginDetails() {
        return new Promise((resolve, reject) => {

            this._storage.get('login_details').then(login_details => {
                if (login_details) {
                    login_details = JSON.parse(login_details);

                    resolve(login_details);
                }

                resolve(false);
            });
        });
    }

    /**
     * Update Login details for a user
     * @param {object} login_details
     * @return {boolean}
     */
    updateLogingDetails(login_details) {
        return new Promise((resolve, reject) => {

            this._storage.get('login_details').then(stored_login_details => {
                stored_login_details = JSON.parse(stored_login_details) || {};

                login_details = _.merge(stored_login_details, login_details);

                this._storage.set('login_details', JSON.stringify(login_details));

                resolve(true);
            })
        })
    }

    /**
     * Check if user is logged in
     * @return {boolean}
     */
    isLoggedIn() {
        return new Promise((resolve, reject) => {
            this.getToken().then((token) => {
                if (token) {
                    this.getUser().then((res) => this.setUser(res));

                    resolve(token);
                }
            });
        })
    }

    /**
     * Log user out and redirect
     * @param {object} error
     * @return {void}
     */
    reject(error) {
        if (error.status == 401) {
            this.logout();

            this._redirect.next(error);
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
     * @return {object}
     */
    setUser(res) {
        this._user = res.data;
    }

    /**
     * Get the current authenticated user from API.
     *
     * @return {object}
     */
    getUser() {
        return new Promise((resolve, reject) => {
            this.api.get('user')
                .subscribe(res => resolve(res), error => reject(error));
        });
    }
}
