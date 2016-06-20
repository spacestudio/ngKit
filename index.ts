import {provide} from '@angular/core';
import {HTTP_PROVIDERS, Http, XSRFStrategy, CookieXSRFStrategy} from '@angular/http';
import {ngKit} from './src/ngkit';
import {ngKitConfig} from './src/config';
import {
    ngKitAuthentication, ngKitAuthorization, ngKitEvent, ngKitHttp, ngKitToken
} from './src/services';

/**
 * Extending cookie xsrf strategy.
 */
export class ngKitCookieXSRFStrategy extends CookieXSRFStrategy {
    //disabled becase it isn't working.
    configureRequest() { }
}

export const NGKIT_PROVIDERS = [
    ngKit,
    ngKitAuthentication,
    ngKitAuthorization,
    ngKitConfig,
    ngKitEvent,
    ngKitHttp,
    HTTP_PROVIDERS,
    ngKitToken,
    { provide: XSRFStrategy, useValue: new ngKitCookieXSRFStrategy() },
];

export * from './src/ngkit';
export * from './src/config';
export * from './src/services';
