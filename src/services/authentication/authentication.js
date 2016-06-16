"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
//import {AppConfig} from './config';
//import {Facebook} from './facebook';
//import * as _ from 'lodash';
var Subject_1 = require('rxjs/Subject');
//import {Storage, LocalStorage} from 'ionic-angular';
var Authentication = (function () {
    /**
     * Constructor
     */
    function Authentication(
        //private config: AppConfig,
        token, http, api) {
        this.token = token;
        this.http = http;
        this.api = api;
        /**
         * Redirection event.
         *
         * @type {Subject}
         */
        this._redirect = new Subject_1.Subject();
        /**
         * [asObservable description]
         *
         * @return {[type]} [description]
         */
        this.redirect$ = this._redirect.asObservable();
        //this._storage = new Storage(LocalStorage);
        this.http.baseUrl = 'http://api.babyhandle.dev';
    }
    /**
     * Login via API
     * @param  {object} credentials
     * @return POST /auth/login
     */
    Authentication.prototype.login = function (credentials) {
        this.updateLogingDetails({ method: 'email_username' });
        return this.http.post('auth/login', credentials);
    };
    /**
     * Login via Facebook
     * @return {promise}
     */
    Authentication.prototype.loginWithFacebook = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.facebook.login().then(function (res) {
                _this.handleFacebookLoginSuccess(res).subscribe(function (res) {
                    _this.storeToken(res.data.token).then(function () {
                        resolve(true);
                    });
                }, function (error) {
                    reject(_this.handleFacebookLoginError(error));
                });
            });
        });
    };
    /**
     * Handle succesful facebook login
     * @param  {object} res
     * @return {promise}
     */
    Authentication.prototype.handleFacebookLoginSuccess = function (res) {
        if (res.status == 'connected') {
            var facebook_credentials = {
                facebook_user_id: res.authResponse.userID,
                facebook_access_token: res.authResponse.accessToken,
                facebook_token_expires: res.authResponse.expiresIn
            };
            this.storeToken(res.authResponse.accessToken, 'facebook_access_token');
            this.updateLogingDetails({ method: 'facebook' });
            return this.http.post('auth/login-facebook', facebook_credentials);
        }
    };
    /**
     * Handle errors on facebook login
     * @param  {object} error
     * @return {[type]}
     */
    Authentication.prototype.handleFacebookLoginError = function (error) {
        console.log(error);
    };
    /**
     * Log user out
     * @return {boolean}
     */
    Authentication.prototype.logout = function () {
        if (this.removeToken()) {
            return true;
        }
        return false;
    };
    Authentication.prototype.forgotPassword = function (credentials) {
        return this.http.post('auth/forgot-password', credentials);
    };
    /**
     * Register a new user
     * @param  {object} data
     * @return POST /register
     */
    Authentication.prototype.register = function (data) {
        this.updateLogingDetails({ method: 'email_username' });
        return this.http.post('register', data);
    };
    /**
     * Store auth token in local storage
     * @param  {string} token
     * @return boolean
     */
    Authentication.prototype.storeToken = function (token, tokenName) {
        return this.token.store(token, tokenName);
    };
    /**
     * Get the authorization token from local storage
     * @return {mixed}
     */
    Authentication.prototype.getToken = function (tokenName) {
        return this.token.get();
    };
    /**
     * Remove the token from local storage
     * @return {boolean}
     */
    Authentication.prototype.removeToken = function (tokenName) {
        return this.token.remove();
    };
    /**
     * Get the login details
     * @return {object}
     */
    Authentication.prototype.getLoginDetails = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._storage.get('login_details').then(function (login_details) {
                if (login_details) {
                    login_details = JSON.parse(login_details);
                    resolve(login_details);
                }
                resolve(false);
            });
        });
    };
    /**
     * Update Login details for a user
     * @param {object} login_details
     * @return {boolean}
     */
    Authentication.prototype.updateLogingDetails = function (login_details) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._storage.get('login_details').then(function (stored_login_details) {
                stored_login_details = JSON.parse(stored_login_details) || {};
                login_details = _.merge(stored_login_details, login_details);
                _this._storage.set('login_details', JSON.stringify(login_details));
                resolve(true);
            });
        });
    };
    /**
     * Check if user is logged in
     * @return {boolean}
     */
    Authentication.prototype.isLoggedIn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getToken().then(function (token) {
                if (token) {
                    _this.getUser().then(function (res) { return _this.setUser(res); });
                    resolve(token);
                }
            });
        });
    };
    /**
     * Log user out and redirect
     * @param {object} error
     * @return {void}
     */
    Authentication.prototype.reject = function (error) {
        if (error.status == 401) {
            this.logout();
            this._redirect.next(error);
        }
    };
    /**
     * Get the current authenticated user.
     *
     * @return {object}
     */
    Authentication.prototype.user = function () {
        return this._user;
    };
    /**
     * Set the current authenticated user.
     *
     * @return {object}
     */
    Authentication.prototype.setUser = function (res) {
        this._user = res.data;
    };
    /**
     * Get the current authenticated user from API.
     *
     * @return {object}
     */
    Authentication.prototype.getUser = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.api.get('user')
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
        });
    };
    Authentication = __decorate([
        core_1.Injectable()
    ], Authentication);
    return Authentication;
}());
exports.Authentication = Authentication;
