import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ngKit } from './ngkit';
import { Config } from './config';
import { Authentication, SocialAuthentication,
    Authorization, Event, Http, Storage, Token, Cache
} from './services/index';

/**
 * Extending cookie xsrf strategy.
 */
export class ngKitCookieXSRFStrategy extends CookieXSRFStrategy {
    // REVIEW: disabled - angular adds by default.
    configureRequest() { }
}

export function XSRFStrategyFactory() {
    return new ngKitCookieXSRFStrategy();
}

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
    { provide: XSRFStrategy, useFactory: XSRFStrategyFactory },
];
