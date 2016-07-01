import {Injectable} from '@angular/core';
import {HTTP_PROVIDERS, Http, XSRFStrategy, CookieXSRFStrategy} from '@angular/http';
import {
    ngKit, ngKitConfig, ngKitAuthentication, ngKitAuthorization,
    ngKitEvent, ngKitHttp, ngKitToken
} from './ngkit';

/**
 * Extending cookie xsrf strategy.
 */
export class ngKitCookieXSRFStrategy extends CookieXSRFStrategy {
    // REVIEW: disabled - angular adds by default.
    configureRequest() { }
}

/**
 * ngKit providers.
 *
 * @type {Array}
 */
export const NGKIT_PROVIDERS = [
    ngKitAuthentication,
    ngKitAuthorization,
    ngKitConfig,
    ngKitEvent,
    ngKitHttp,
    HTTP_PROVIDERS,
    ngKitToken,
    { provide: XSRFStrategy, useValue: new ngKitCookieXSRFStrategy() },
];

/**
 * ngKit initializer.
 *
 * @param  {any}   options
 * @return {any[]}
 */
export function ngKitInit(options: any): any[] {
    let kit = new ngKit(new ngKitConfig);
    let config = kit.init(options);

    return [
        NGKIT_PROVIDERS,
        { provide: ngKit, useValue: kit },
        { provide: ngKitConfig, useValue: config },
    ];
}
