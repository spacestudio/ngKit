import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { NgModule } from '@angular/core';
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
export const NGKIT_SERVICES = [
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

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [NGKIT_SERVICES]
})
export class ngKitServicesModule { }

/**
 * ngKit initializer.
 *
 * @param  {any} options
 * @return {any[]}
 */
export function ngKitModuleInit(options: any): any[] {
    let kit = new ngKit(new Config);
    let config = kit.init(options);

    return [
        ngKitServicesModule,
        { provide: ngKit, useValue: kit },
        { provide: Config, useValue: config },
    ];
}
