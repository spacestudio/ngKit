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
var config_1 = require('./../config');
var Authentication = (function () {
    function Authentication(token, http, rest, ngKit, config) {
        this.token = token;
        this.http = http;
        this.rest = rest;
        this.ngKit = ngKit;
        this.config = config;
        this._storage = localStorage;
    }
    Authentication.prototype.login = function (credentials, endpoint) {
        var _this = this;
        if (endpoint === void 0) { endpoint = ''; }
        endpoint = this.config.get('authentication.endpoints.login', endpoint);
        return new Promise(function (resolve, reject) {
            return _this.http.post(endpoint, credentials)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
        });
    };
    Authentication.prototype.logout = function () {
        if (this.removeToken())
            return true;
        return false;
    };
    Authentication.prototype.forgotPassword = function (credentials, endpoint) {
        var _this = this;
        endpoint = this.config.get('authentication.endpoints.forgotPassword', endpoint);
        return new Promise(function (resolve, reject) {
            return _this.http.post(endpoint, credentials)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
        });
    };
    Authentication.prototype.register = function (data, endpoint) {
        var _this = this;
        if (endpoint === void 0) { endpoint = ''; }
        endpoint = this.config.get('authentication.endpoints.register', endpoint);
        return new Promise(function (resolve, reject) {
            return _this.http.post(endpoint, data)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
            ;
        });
    };
    Authentication.prototype.check = function (endpoint) {
        var _this = this;
        if (endpoint === void 0) { endpoint = ''; }
        endpoint = this.config.get('authentication.endpoints.check', endpoint);
        return new Promise(function (resolve, reject) {
            _this.token.get().then(function (token) {
                _this.getUser('').then(function (res) {
                    _this.setUser(res);
                    resolve(true);
                }, function () { return reject(false); });
            }, function () { return reject(false); });
        });
    };
    Authentication.prototype.reject = function (error) {
        if (error.status == 401) {
            this.logout();
        }
    };
    Authentication.prototype.user = function () {
        return this._user;
    };
    Authentication.prototype.setUser = function (user) {
        this._user = user;
    };
    Authentication.prototype.getUser = function (endpoint) {
        var _this = this;
        if (endpoint === void 0) { endpoint = ''; }
        endpoint = this.config.get('authentication.endpoints.getUser', endpoint);
        return new Promise(function (resolve, reject) {
            _this.rest.get(endpoint)
                .subscribe(function (res) { return resolve(res); }, function (error) { return reject(error); });
        });
    };
    Authentication.prototype.storeToken = function (token, tokenName) {
        return this.token.set(token, tokenName);
    };
    Authentication.prototype.getToken = function (tokenName) {
        return this.token.get(tokenName);
    };
    Authentication.prototype.removeToken = function (tokenName) {
        return this.token.remove(tokenName);
    };
    Authentication = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [token_1.Token, http_client_1.HttpClient, rest_client_1.RestClient, ngkit_1.ngKit, config_1.Config])
    ], Authentication);
    return Authentication;
}());
exports.Authentication = Authentication;
