import { Http, Headers, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
export declare class HttpClient {
    http: Http;
    /**
     * Assignable base url for http calls.
     *
     * @type {string}
     */
    baseUrl: string;
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
    constructor(http: Http);
    /**
     * Adds the authorization header to the API call
     * @param  {Headers} headers Angular header provider
     */
    createHeaders(headers: Headers): void;
    /**
     * Set the headers for the API client.
     *
     * @return Void
     */
    setHeaders(): void;
    /**
     * Build url parameters for requests.
     *
     * @param  {object} params
     * @return {Object}
     */
    buildParams(params: any): URLSearchParams;
    /**
     * Get location for http request.
     *
     * @param  {string} url
     * @return {string} url
     */
    private getLocation(url);
    /**
    * Perform a GET http request to API.
    *
    * @param  {string} url
    * @param  {object} params
    * @return {Observable}
    */
    get(url: any, params?: any): Observable<Response>;
    /**
    * Perform a POST http request.
    *
    * @param  {string} url
    * @param  {object} data Data to pass to the API
    * @return {Observable}
    */
    post(url: any, data: any): Observable<Response>;
    /**
    * Perform a PUT http request.
    *
    * @param  {string} url
    * @param  {object} data
    * @return {Observable}
    */
    put(url: string, data: any): Observable<Response>;
    /**
    * Perform a DELETE http request.
    *
    * @param  {string} url
    * @return {Observable}
    */
    delete(url: string): Observable<Response>;
    /**
     * Catch errors from response.
     *
     * @param {objet} error Response
     * @return {object} Observable
     */
    private catchError(error);
    /**
     * Handle error from http request.
     *
     * @param  {object} error
     * @return {void}
     */
    onError(error: any): void;
}
