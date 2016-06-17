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
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var HttpClient = (function () {
    /**
     * Constructor.
     *
     * @param  {Http}   http
     */
    function HttpClient(http) {
        this.http = http;
        /**
         * Assignable base url for http calls.
         *
         * @type {string}
         */
        this.baseUrl = '';
        this.setHeaders();
    }
    /**
     * Adds the authorization header to the API call
     * @param  {Headers} headers Angular header provider
     */
    HttpClient.prototype.createHeaders = function (headers) {
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
    };
    /**
     * Set the headers for the API client.
     *
     * @return Void
     */
    HttpClient.prototype.setHeaders = function () {
        var headers = new http_1.Headers();
        this.createHeaders(headers);
        this.headers = headers;
    };
    /**
     * Build url parameters for requests.
     *
     * @param  {object} params
     * @return {Object}
     */
    HttpClient.prototype.buildParams = function (params) {
        var query_params = new http_1.URLSearchParams();
        if (params) {
            Object.keys(params).forEach(function (key) {
                if (params[key])
                    query_params.set(key, params[key]);
            });
        }
        return query_params;
    };
    /**
     * Get location for http request.
     *
     * @param  {string} url
     * @return {string} url
     */
    HttpClient.prototype.getLocation = function (url) {
        return (this.baseUrl) ? this.baseUrl + '/' + url : url;
    };
    /**
    * Perform a GET http request to API.
    *
    * @param  {string} url
    * @param  {object} params
    * @return {Observable}
    */
    HttpClient.prototype.get = function (url, params) {
        return this.http.get(this.getLocation(url), {
            headers: this.headers,
            search: this.buildParams(params)
        }).map(function (res) { return res.json(); }, function (error) { return error.json().error; })
            .catch(this.catchError);
    };
    /**
    * Perform a POST http request.
    *
    * @param  {string} url
    * @param  {object} data Data to pass to the API
    * @return {Observable}
    */
    HttpClient.prototype.post = function (url, data) {
        return this.http.post(this.getLocation(url), JSON.stringify(data), {
            headers: this.headers
        }).map(function (res) { return res.json(); }, function (error) { return error.json().error; })
            .catch(this.catchError);
    };
    /**
    * Perform a PUT http request.
    *
    * @param  {string} url
    * @param  {object} data
    * @return {Observable}
    */
    HttpClient.prototype.put = function (url, data) {
        return this.http.put(this.getLocation(url), JSON.stringify(data), {
            headers: this.headers
        }).map(function (res) { return res.json(); }, function (error) { return error.json().error; })
            .catch(this.catchError);
    };
    /**
    * Perform a DELETE http request.
    *
    * @param  {string} url
    * @return {Observable}
    */
    HttpClient.prototype.delete = function (url) {
        return this.http.delete(this.getLocation(url), {
            headers: this.headers
        }).map(function (res) { return res.json(); }, function (error) { return error.json().error; })
            .catch(this.catchError);
    };
    /**
     * Catch errors from response.
     *
     * @param {objet} error Response
     * @return {object} Observable
     */
    HttpClient.prototype.catchError = function (error) {
        console.error(error);
        this.onError(error);
        return Rx_1.Observable.throw(error.json().error || 'Server error');
    };
    /**
     * Handle error from http request.
     *
     * @param  {object} error
     * @return {void}
     */
    HttpClient.prototype.onError = function (error) {
        // TODO:
    };
    HttpClient = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], HttpClient);
    return HttpClient;
}());
exports.HttpClient = HttpClient;
