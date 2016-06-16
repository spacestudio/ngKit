import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams, Response} from '@angular/http';
//import {AppConfig} from './config';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpClient {

    baseUrl: any = null;

    headers: any;

    /**
     * Constructor
     * @param  {Http}   http
     */
    constructor(
        public http: Http
        //public config: AppConfig
    ) {
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
     * Set the headers for the API client
     */
    setHeaders() {
        let headers = new Headers();
        this.createHeaders(headers);
        this.headers = headers;
    }

    /**
     * Build url parameters for requests
     * @param  {object} params
     * @return query_params
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
     * Get location for http request
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
        }).map(
            res => res.json(),
            error => error.json().error
            ).catch(this.catchError);
    }

    /**
     * Catch errors from response
     * @param {objet} error Response
     * @return {object} Observable
     */
    catchError = (error: Response) => {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);

        this.broadcastError(error);

        return Observable.throw(error.json().error || 'Server error');
    }

    /**
     * Broadcast error to app
     * @param  {object} error
     * @return {void}
     */
    broadcastError(error) { }
}
