import { ngKit } from './src/ngkit';
import { Config } from './src/config';
import { Authentication, Authorization, RestClient, HttpClient, Token } from './src/services';
export * from './src/ngkit';
export * from './src/config';
export * from './src/services';
export declare const NGKIT_PROVIDERS: (typeof ngKit | typeof Authentication | typeof Authorization | typeof Config | typeof RestClient | typeof HttpClient | any[] | typeof Token)[];
