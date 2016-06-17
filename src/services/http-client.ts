import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Config} from './../config';
import {Token} from './token';

@Injectable()
export class HttpClient {

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
    headers: any;

    /**
     * Constructor.
     *
     * @param  {Http}   http
     */
    constructor(
        public http: Http,
        public config: Config,
        public token: Token
    ) {
        this.setDefaultHeaders();
    }

    /**
     * Adds headers to http requests.
     *
     * @param  {Headers} headers Angular header provider
     */
    createHeaders(headers: Headers) {
        let configHeaders = this.config.get('http.headers');

        Object.keys(configHeaders).forEach(key => {
            headers.append(key, configHeaders[key]);
        });

        this.tokenHeader(headers);
    }

    /**
     * Add a token header to the request.
     *
     * @param  {Headers} headers
     *
     * @return {void}
     */
    tokenHeader(headers: Headers): void {
        if (this.config.get('authentication.method.token')) {
            this.token.get().then(token => {
                let scheme = this.config.get('authentication.token.scheme');

                headers.append('Authorization', `${scheme} ${token}`);
            });
        }
    }

    /**
     * Set the default headers for http request.
     *
     * @return {void}
     */
    setDefaultHeaders(): void {
        let headers = new Headers();

        this.createHeaders(headers);
        this.headers = headers;
    }

    /**
     * Build url parameters for requests.
     *
     * @param  {object} params
     *
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
    get(url, params?): Observable<Response> {
        return this.http.get(this.getLocation(url), {
            headers: this.headers,
            search: this.buildParams(params)
        }).map(res => res.json(), error => error.json().error)
            .catch(this.catchError);
    }

    /**
    * Perform a POST http request.
    *
    * @param  {string} url
    * @param  {object} data Data to pass to the API
    * @return {Observable}
    */
    post(url, data): Observable<Response> {
        return this.http.post(this.getLocation(url), JSON.stringify(data), {
            headers: this.headers
        }).map(res => res.json(), error => error.json().error)
            .catch(this.catchError);
    }

    /**
    * Perform a PUT http request.
    *
    * @param  {string} url
    * @param  {object} data
    *
    * @return {Observable}
    */
    put(url: string, data: any): Observable<Response> {
        return this.http.put(this.getLocation(url), JSON.stringify(data), {
            headers: this.headers
        }).map(res => res.json(), error => error.json().error)
            .catch(this.catchError);
    }

    /**
    * Perform a DELETE http request.
    *
    * @param  {string} url
    *
    * @return {Observable}
    */
    delete(url: string): Observable<Response> {
        return this.http.delete(this.getLocation(url), {
            headers: this.headers
        }).map(res => res.json(), error => error.json().error)
            .catch(this.catchError);
    }

    /**
     * Catch errors from response.
     *
     * @param {objet} error Response
     *
     * @return {object} Observable
     */
    private catchError(error: Response) {
        this.onError(error);

        return Observable.throw(error.json().error || 'Server Error');
    }

    /**
     * Handle error from http request.
     *
     * @param  {object} error
     *
     * @return {void}
     */
    onError(error) {
        console.error(error);

        // TODO: Add ability to add custom error handler.
    }
}
