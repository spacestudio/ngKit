import { HttpClient } from './http-client';
import { Token } from './token';
import { RestClient } from './rest-client';
import { ngKit } from './../ngkit';
import { Config } from './../config';
export declare class Authentication {
    private token;
    private http;
    private rest;
    private ngKit;
    private config;
    private _storage;
    private _user;
    constructor(token: Token, http: HttpClient, rest: RestClient, ngKit: ngKit, config: Config);
    login(credentials: any, endpoint?: string): Promise<any>;
    logout(): boolean;
    forgotPassword(credentials: any, endpoint: string): Promise<any>;
    register(data: any, endpoint?: string): Promise<any>;
    check(endpoint?: string): Promise<boolean>;
    reject(error: any): void;
    user(): any;
    setUser(user: any): void;
    getUser(endpoint?: string): Promise<any>;
    storeToken(token: any, tokenName?: string): Promise<any>;
    getToken(tokenName?: string): Promise<any>;
    removeToken(tokenName?: any): boolean;
}
