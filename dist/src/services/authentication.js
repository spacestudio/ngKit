"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_client_1 = require('./http-client');
var token_1 = require('./token');
var rest_client_1 = require('./rest-client');
var ngkit_1 = require('./../ngkit');
var Authentication = (function () {
    /**
     * Constructor
     */
    function Authentication(token, http, rest, ngKit) {
        this.token = token;
        this.http = http;
        this.rest = rest;
        this.ngKit = ngKit;
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
     * Check if user is logged in.
     *
     * @return {Promise}
     */
    Authentication.prototype.check = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.token.get().then(function (token) {
                _this.getUser('').then(function (res) {
                    _this.setUser(res);
                    resolve(true);
                }, function () { return reject(false); });
            }, function () { return reject(false); });
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
     * Get the current authenticated user.
     *
     * @return {object}
     */
    Authentication.prototype.getUser = function (endpoint) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rest.get(endpoint)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
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
        return this.token.get(tokenName);
    };
    /**
     * Remove the token from local storage.
     *
     * @return {boolean}
     */
    Authentication.prototype.removeToken = function (tokenName) {
        return this.token.remove(tokenName);
    };
    Authentication = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [token_1.Token, http_client_1.HttpClient, rest_client_1.RestClient, ngkit_1.ngKit])
    ], Authentication);
    return Authentication;
}());
exports.Authentication = Authentication;
