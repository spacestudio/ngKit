import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import {
    ngKit, Config, Authentication, SocialAuthentication,
    Authorization, Event, Http, Token, LocalStorage, Cache
} from './ngkit';

/**
 * Extending cookie xsrf strategy.
 */
export class ngKitCookieXSRFStrategy extends CookieXSRFStrategy {
    // REVIEW: disabled - angular adds by default.
    configureRequest() { }
}

/**
 * ngKit Services.
 *
 * @type {Array}
 */
export const NGKIT_PROVIDERS = [
    Authentication,
    SocialAuthentication,
    Authorization,
    LocalStorage,
    Config,
    Cache,
    Event,
    Http,
    Token,
    { provide: XSRFStrategy, useValue: new ngKitCookieXSRFStrategy() },
];
