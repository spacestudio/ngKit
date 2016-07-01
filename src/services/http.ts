import {Component, Injectable} from '@angular/core';
import {
    Http as HTTP, Headers, Response, URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {ngKit} from './../ngKit';
import {ngKitConfig} from './../config';
import {ngKitEvent} from './event';
import {ngKitToken} from './token';

@Injectable()
export class ngKitHttp {

    /**
     * Assignable base url for http calls.
     *
     * @type {string}
     */
    baseUrl: string = '';

    /**
     * Headers to be sent with all http calls.
     *
     * @type {any}
     */
    private headers: any;

    /**
     * Constructor.
     *
     * @param  {Http}   http
     */
    constructor(
        public http: HTTP,
        public config: ngKitConfig,
        public event: ngKitEvent,
        public token: ngKitToken
    ) {
        this.setDefaultHeaders();

        this.event.listen('auth:login').subscribe(() => {
            this.setDefaultHeaders();
        });

        this.event.listen('auth:check').subscribe(() => {
            this.setDefaultHeaders();
        });
    }

    /**
     * Adds headers to http requests.
     *
     * @param  {Headers} headers Angular header provider
     * @return {Headers}

     */
    createHeaders(headers: Headers): Headers {
        let configHeaders = this.config.get('http.headers');

        if (configHeaders) {
            Object.keys(configHeaders).forEach(key => {
                headers.append(key, configHeaders[key]);
            });
        }

        headers = this.tokenHeader(headers);

        return headers;
    }

    /**
     * Add a token header to the request.
     *
     * @param  {Headers} headers
     * @return {Headers}
     */
    tokenHeader(headers: Headers): Headers {
        if (this.config.get('authentication.method.token')) {

            this.token.get().then(token => {
                if (token) {
                    let scheme = this.config.get('token.scheme');
                    let header_value = (scheme) ? `${scheme} ${token}` : token;

                    headers.append('Authorization', header_value);
                }
            });
        }

        return headers;
    }

    /**
     * Set the default headers for http request.
     *
     * @return {void}
     */
    setDefaultHeaders(): void {
        let headers = new Headers();

        headers = this.createHeaders(headers);

        this.headers = headers;
    }

    /**
     * Build url parameters for requests.
     *
     * @param  {object} params
     * @return {URLSearchParams}
     */
    buildParams(params): URLSearchParams {
        var query_params = new URLSearchParams();

        if (params) {
            Object.keys(params).forEach((key) => {
                if (params[key]) query_params.set(key, params[key]);
            });
        }

        return query_params;
    }

    /**
     * Get location for http request.
     *
     * @param  {string} url
     * @return {string} url
     */
    private getLocation(url) {
        let baseUrl = this.baseUrl || this.config.get('http.baseUrl');

        return (baseUrl) ? baseUrl + '/' + url : url;
    }

    /**
     * Perform a GET http request to API.
     *
     * @param  {string} url
     * @param  {object} params
     * @return {Observable}
     */
    get(url, params?) {
        return this.http.get(this.getLocation(url), {
            headers: this.headers,
            search: this.buildParams(params)
        }).map(res => res.json(), error => error.json())
            .catch(this.handleError);
    }

    /**
    * Perform a POST http request.
    *
    * @param  {string} url
    * @param  {object} data Data to pass to the API
    * @return {Observable}
    */
    post(url: string, data: any): Observable<Response> {
        return this.http.post(
            this.getLocation(url),
            JSON.stringify(data),
            { headers: this.headers }
        ).map(res => res.json(), error => error.json())
            .catch(this.handleError);
    }

    /**
    * Perform a PUT http request.
    *
    * @param  {string} url
    * @param  {object} data
    * @return {Observable}
    */
    put(url: string, data: any): Observable<Response> {
        return this.http.put(
            this.getLocation(url),
            JSON.stringify(data),
            { headers: this.headers }
        ).map(res => res.json(), error => error.json())
            .catch(this.handleError);
    }

    /**
    * Perform a DELETE http request.
    *
    * @param  {string} url
    * @return {Observable}
    */
    delete(url: string): Observable<Response> {
        return this.http.delete(this.getLocation(url), {
            headers: this.headers
        }).map(res => res.json(), error => error.json())
            .catch(this.handleError);
    }

    /**
     * Catch errors from response.
     *
     * @param {objet} error Response
     * @return {object} Observable
     */
    private handleError(error: Response) {
        // TODO: Add a debug mode check
        console.error(error);

        return Observable.throw(error.json() || 'Server Error');
    }
}
