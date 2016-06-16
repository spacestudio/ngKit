import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {HttpClient} from './../http-client';
import {Token} from './../token';
import {Authentication} from './../authentication';

@Injectable()
export class ApiClient extends HttpClient {

    public baseUrl = 'http://api.babyhandle.dev';

    headers;

    /**
     * Constructor
     * @param  {Http}   http
     */
    constructor(
        public http: Http,
        public config: AppConfig,
        private token: Token
    ) {
        super(http, config);

        this.setHeaders();
    }

    /**
     * Adds the authorization header to the API call.
     *
     * @param  {Headers} headers
     */
    createHeaders(headers: Headers) {
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        if (this.token) {
            this.token.get().then(token => {
                if (token) {
                    headers.append('Authorization', 'Bearer ' + token);
                }
            });
        }
    }

    /**
     * Broadcast error to authentication service.
     *
     * @param  {object} error
     * @return {void}
     */
    broadcastError(error) {
        //this.auth.reject(error);
    }
}
