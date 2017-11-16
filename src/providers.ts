import { Config } from './config';
import {
    Authentication, Authorization, Event, Http, SocialAuthentication,
    Storage, Token, Cache
} from './services/index';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor } from './services/http-interceptor';
import { AuthInterceptor } from './services/http-auth-interceptor';

/**
 * ngKit Services.
 *
 * @type {Array}
 */
export const NGKIT_PROVIDERS: any[] = [
    Authentication,
    SocialAuthentication,
    Authorization,
    Config,
    Storage,
    Cache,
    Event,
    Http,
    Token,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpInterceptor,
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
];
