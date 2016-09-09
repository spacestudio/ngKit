import { Injectable, NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NGKIT_PROVIDERS } from './providers';
import { Config } from './config';

export * from './config';
export * from './services';
export * from './providers';
export * from './decorators';
// export * from './pipes';

@Injectable()
export class ngKit {
    /**
     * Create a new ngKit Instance.
     *
     * @param  {object} options
     * @param  {Config} config
     */
    constructor(private config: Config) { }

    /**
     * Initialize ngKit with configurable options.
     *
     * @param  {object} options
     * @return {Config}
     */
    init(options: any): Config {
        return this.config.setOptions(options);
    }
}

/**
 * ngKit module initializer.
 *
 * @param  {any} options
 * @return {ngKitModule}
 */
@NgModule()
export class ngKitModule {

    static init(options: any): ModuleWithProviders {
        let kit = new ngKit(new Config);
        let config = kit.init(options);

        return {
            ngModule: ngKitModule,
            providers: [
                { provide: ngKit, useValue: kit },
                { provide: Config, useValue: config },
                ...NGKIT_PROVIDERS
            ]
        }
    }
}
