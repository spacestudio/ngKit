import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {HttpClient} from './../http-client';
import {Token} from './../token';
import {Authentication} from './../authentication';

@Injectable()
export class ApiClient extends HttpClient {

    /**
     * Constructor.
     *
     * @param  {Http}   http
     */
    constructor(
        public http: Http,
        private auth: Authentication,
        private token: Token
    ) {
        super(http);

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


        this.auth.isLoggedIn().then(() => {
            // REVIEW: How can we make this customizable?
            this.token.get().then(token => {
                if (token) {
                    headers.append('Authorization', 'Bearer ' + token);
                }
            });
        });
    }

    /**
     * Broadcast error to authentication service.
     *
     * @param  {object} error
     * @return {void}
     */
    onError(error) {
        // REVIEW: Do we need to place this in the Authorization service?
        //this.auth.reject(error);
    }
}
