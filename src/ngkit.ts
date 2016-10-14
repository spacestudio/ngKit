import { Injectable, NgModule, ModuleWithProviders } from '@angular/core';
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
    constructor(private config: Config, options) {
        this.config.setOptions(options);
    }
}

/**
 * ngKitConfig config stub.
 * @type {Object}
 */
export const ngKitConfig = {};

/**
 * ngKit Provider Factory.
 *
 * @param  {Config} config
 * @param  {any} options
 * @return {ngKit}
 */
export function ngKitFactory(config: Config, options: any): ngKit {
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
                    provide: ngKitConfig,
                    useValue: options
                }, {
                    provide: ngKit,
                    useFactory: ngKitFactory,
                    deps: [Config, ngKitConfig]
                }]
        }
    }
}
