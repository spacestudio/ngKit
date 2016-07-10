import {Injectable} from '@angular/core';
import {HTTP_PROVIDERS, XSRFStrategy, CookieXSRFStrategy} from '@angular/http';
import {
    ngKit, Config, Authentication, FacebookAuthentication, Authorization,
    Event, Http, Token
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
    Authentication,
    FacebookAuthentication,
    Authorization,
    Config,
    Event,
    Http,
    HTTP_PROVIDERS,
    Token,
    { provide: XSRFStrategy, useValue: new ngKitCookieXSRFStrategy() },
];

/**
 * ngKit initializer.
 *
 * @param  {any}   options
 * @return {any[]}
 */
export function ngKitInit(options: any): any[] {
    let kit = new ngKit(new Config);
    let config = kit.init(options);

    return [
        NGKIT_PROVIDERS,
        { provide: ngKit, useValue: kit },
        { provide: Config, useValue: config },
    ];
}
