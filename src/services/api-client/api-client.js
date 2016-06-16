"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_client_1 = require('./../http-client');
var ApiClient = (function (_super) {
    __extends(ApiClient, _super);
    /**
     * Constructor.
     *
     * @param  {Http}   http
     */
    function ApiClient(http, auth, token) {
        _super.call(this, http);
        this.http = http;
        this.auth = auth;
        this.token = token;
        this.setHeaders();
    }
    /**
     * Adds the authorization header to the API call.
     *
     * @param  {Headers} headers
     */
    ApiClient.prototype.createHeaders = function (headers) {
        var _this = this;
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        this.auth.isLoggedIn().then(function () {
            // REVIEW: How can we make this customizable?
            _this.token.get().then(function (token) {
                if (token) {
                    headers.append('Authorization', 'Bearer ' + token);
                }
            });
        });
    };
    /**
     * Broadcast error to authentication service.
     *
     * @param  {object} error
     * @return {void}
     */
    ApiClient.prototype.onError = function (error) {
        // REVIEW: Do we need to place this in the Authorization service?
        //this.auth.reject(error);
    };
    ApiClient = __decorate([
        core_1.Injectable()
    ], ApiClient);
    return ApiClient;
}(http_client_1.HttpClient));
exports.ApiClient = ApiClient;
