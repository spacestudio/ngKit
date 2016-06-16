"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Token = (function () {
    function Token() {
        /**
         * Name of token stored in local storage.
         *
         * @type {string}
         */
        this._token = '_token';
        this._storage = localStorage;
    }
    /**
     * Get the token from local storage.
     * @param  {string} tokenName
     * @return {Promise}
     */
    Token.prototype.get = function (tokenName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            tokenName = tokenName || _this._token;
            var token = _this._storage.getItem(tokenName);
            if (token) {
                resolve(token);
            }
            else {
                reject('No token found.');
            }
        });
    };
    /**
     * Store the token in local storage.
     *
     * @param  {string} token
     * @param  {string} tokenName
     * @return {Promise}
     */
    Token.prototype.set = function (token, tokenName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            tokenName = tokenName || _this._token;
            if (token) {
                _this._storage.setItem(tokenName, token);
                resolve(true);
            }
            reject('Please enter a token to store.');
        });
    };
    /**
     * Remove token from local storage.
     *
     * @param  {string}  tokenName
     * @return {boolean}
     */
    Token.prototype.remove = function (tokenName) {
        tokenName = tokenName || this._token;
        this._storage.remove(tokenName);
        return true;
    };
    Token = __decorate([
        core_1.Injectable()
    ], Token);
    return Token;
}());
exports.Token = Token;
