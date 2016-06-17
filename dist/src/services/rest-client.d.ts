import { Http, Headers } from '@angular/http';
import { HttpClient } from './http-client';
import { Token } from './token';
export declare class RestClient extends HttpClient {
    http: Http;
    private token;
    /**
     * Constructor.
     *
     * @param  {Http}   http
     */
    constructor(http: Http, token: Token);
    /**
     * Adds the authorization header to the API call.
     *
     * @param  {Headers} headers
     */
    createHeaders(headers: Headers): void;
    /**
     * Broadcast error to authentication service.
     *
     * @param  {object} error
     * @return {void}
     */
    onError(error: any): void;
}
