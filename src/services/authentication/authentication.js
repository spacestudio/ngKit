"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Subject_1 = require('rxjs/Subject');
var Authentication = (function () {
    /**
     * Constructor
     */
    function Authentication(token, http, api) {
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
         * // REVIEW:
         * [asObservable description]
         *
         * @return {[type]} [description]
         */
        this.redirect$ = this._redirect.asObservable();
        this._storage = localStorage;
    }
    /**
     * Send a login request.
     *
     * @param  {string} endpoint
     * @param  {object} credentials
     * @return {Promise}
     */
    Authentication.prototype.login = function (endpoint, credentials) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.http.post(endpoint, credentials)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
        });
    };
    /**
     * Log user out
     * @return {boolean}
     */
    Authentication.prototype.logout = function () {
        if (this.removeToken())
            return true;
        return false;
    };
    /**
     * Send a forgot password request.
     *
     * @param  {string} endpoint
     * @param  {object}  credentials
     * @return {Promise}
     */
    Authentication.prototype.forgotPassword = function (endpoint, credentials) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.http.post(endpoint, credentials)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
        });
    };
    /**
     * Send a register request.
     *
     * @param  {object} data
     * @return {Promise}
     */
    Authentication.prototype.register = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.http.post('register', data)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
            ;
        });
    };
    /**
     * Store auth token in local storage.
     *
     * @param  {string} token
     * @return {Promise}
     */
    Authentication.prototype.storeToken = function (token, tokenName) {
        return this.token.set(token, tokenName);
    };
    /**
     * Get the authorization token from local storage.
     *
     * @return {Promise}
     */
    Authentication.prototype.getToken = function (tokenName) {
        return this.token.get();
    };
    /**
     * Remove the token from local storage.
     *
     * @return {boolean}
     */
    Authentication.prototype.removeToken = function (tokenName) {
        return this.token.remove();
    };
    /**
     * Check if user is logged in.
     *
     * @return {Promise}
     */
    Authentication.prototype.isLoggedIn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.token.get().then(function (token) {
                if (token) {
                    _this.getUser().then(function (res) { return _this.setUser(res); });
                    resolve(token);
                }
            });
        });
    };
    /**
     * Log user out and redirect.
     *
     * @param {object} error
     * @return {void}
     */
    Authentication.prototype.reject = function (error) {
        if (error.status == 401) {
            this.logout();
            // REVIEW:
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
     * @return {void}
     */
    Authentication.prototype.setUser = function (user) {
        this._user = user;
    };
    /**
     * Get the current authenticated user from API.
     *
     * @return {object}
     */
    Authentication.prototype.getUser = function (endpoint) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.api.get(endpoint)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
        });
    };
    Authentication = __decorate([
        core_1.Injectable()
    ], Authentication);
    return Authentication;
}());
exports.Authentication = Authentication;
