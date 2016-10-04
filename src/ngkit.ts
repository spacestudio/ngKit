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
    static forRoot(options: any): ModuleWithProviders {
        let kit = new ngKit(new Config);
        let config = kit.init(options);

        return {
            ngModule: ngKitModule,
            providers: [
                // ...NGKIT_PROVIDERS,
                { provide: ngKit, useValue: kit },
                { provide: Config, useValue: config }
            ]
        }
    }
}
