import { Http, Headers } from '@angular/http';
import { HttpClient } from './http-client';
import { Token } from './token';
export declare class ApiClient extends HttpClient {
    http: Http;
    private token;
    constructor(http: Http, token: Token);
    createHeaders(headers: Headers): void;
    onError(error: any): void;
}
