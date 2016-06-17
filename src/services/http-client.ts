import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

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
    constructor(public http: Http) {
        this.setHeaders();
    }

    /**
     * Adds the authorization header to the API call
     * @param  {Headers} headers Angular header provider
     */
    createHeaders(headers: Headers) {
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
    }

    /**
     * Set the headers for the API client.
     *
     * @return Void
     */
    setHeaders(): void {
        let headers = new Headers();
        this.createHeaders(headers);
        this.headers = headers;
    }

    /**
     * Build url parameters for requests.
     *
     * @param  {object} params
     * @return {Object}
     */
    buildParams(params) {
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
        return (this.baseUrl) ? this.baseUrl + '/' + url : url;
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
     * @return {object} Observable
     */
    private catchError(error: Response) {
        console.error(error);

        this.onError(error);

        return Observable.throw(error.json().error || 'Server error');
    }

    /**
     * Handle error from http request.
     *
     * @param  {object} error
     * @return {void}
     */
    onError(error) {
        // TODO:
    }
}
