import {HTTP_PROVIDERS} from '@angular/http';
import {ngKit} from './src/ngkit';
import {Config} from './src/config';
import {
    Authentication, Authorization, RestClient, HttpClient, Token
} from './src/services';

export * from './src/ngkit';
export * from './src/config';
export * from './src/services';

export const NGKIT_PROVIDERS = [
    ngKit,
    Authentication,
    Authorization,
    Config,
    RestClient,
    HttpClient,
    HTTP_PROVIDERS,
    Token,
];
