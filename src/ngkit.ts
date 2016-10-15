import {
    Injectable, NgModule, Inject, ModuleWithProviders, OpaqueToken
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { NGKIT_PROVIDERS } from './providers';
import { Config } from './config';

export const ngKitOptions = {};//new OpaqueToken('NGKITOPTIONS');

export class ngKit {
    /**
     * Create a new ngKit Instance.
     *
     * @param  {object} options
     * @param  {Config} config
     */
    constructor(public config, public options) {
        this.config.setOptions(options);

        return this;
    }
}

/**
 * ngKit Provider Factory.
 *
 * @param  {ngKitOptions} options
 * @return {ngKit}
 */
export function ngKitFactory(options: any) {
    let config = new Config;

    return new ngKit(config, options);
}

@NgModule({
    imports: [HttpModule],
    exports: [HttpModule],
    providers: NGKIT_PROVIDERS
})
export class ngKitModule {
    /**
     * ngKit module initializer.
     *
     * @param  {any} options
     * @return {ngKitModule}
     */
    static forRoot(options: any = null): ModuleWithProviders {
        return {
            ngModule: ngKitModule,
            providers: [
                { provide: ngKitOptions, useValue: options },
                { provide: ngKit, useValue: ngKitFactory(options) }
            ]
        }
    }
}
