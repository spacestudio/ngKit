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
var ApiClient = (function (_super) {
    __extends(ApiClient, _super);
    /**
     * Constructor
     * @param  {Http}   http
     */
    function ApiClient(http, config, token) {
        _super.call(this, http, config);
        this.http = http;
        this.config = config;
        this.token = token;
        this.baseUrl = 'http://api.babyhandle.dev';
        this.setHeaders();
    }
    /**
     * Adds the authorization header to the API call.
     *
     * @param  {Headers} headers
     */
    ApiClient.prototype.createHeaders = function (headers) {
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        if (this.token) {
            this.token.get().then(function (token) {
                if (token) {
                    headers.append('Authorization', 'Bearer ' + token);
                }
            });
        }
    };
    /**
     * Broadcast error to authentication service.
     *
     * @param  {object} error
     * @return {void}
     */
    ApiClient.prototype.broadcastError = function (error) {
        //this.auth.reject(error);
    };
    ApiClient = __decorate([
        core_1.Injectable()
    ], ApiClient);
    return ApiClient;
}(HttpClient));
exports.ApiClient = ApiClient;
