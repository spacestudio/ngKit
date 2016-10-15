import { Injectable, NgModule, ModuleWithProviders, OpaqueToken } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NGKIT_PROVIDERS } from './providers';
import { Config } from './config';

@Injectable()
export class ngKit {
    /**
     * Create a new ngKit Instance.
     *
     * @param  {object} options
     * @param  {Config} config
     */
    constructor(public config: Config, public options) {
        this.config.setOptions(options);
    }
}

/**
 * ngKitConfig config stub.
 *
 * @type {OpaqueToken}
 */
export const ngKitOptions = new OpaqueToken('NGKIT_CONFIG');

/**
 * ngKit Provider Factory.
 *
 * @param  {Config} config
 * @param  {any} options
 * @return {ngKit}
 */
export function ngKitFactory(options: any): ngKit {
    let config = new Config;

    return new ngKit(config, options);
}

@NgModule({
    declarations: [],
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
    static forRoot(options: any): ModuleWithProviders {

        return {
            ngModule: ngKitModule,
            providers: [
                ...NGKIT_PROVIDERS,
                {
                    provide: ngKitOptions,
                    useValue: options
                }, {
                    provide: ngKit,
                    useFactory: ngKitFactory,
                    deps: [ngKitOptions]
                }]
        }
    }
}
