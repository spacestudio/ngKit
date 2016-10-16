import {
    Injectable, NgModule, Inject, ModuleWithProviders
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { NGKIT_PROVIDERS } from './providers';
import { Config } from './config';

export class ngKit {
    /**
     * Create a new ngKit Instance.
     *
     * @param  {object} options
     * @param  {Config} config
     */
    constructor(public config, public options) {
        this.config.setOptions(this.options);
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
    static forRoot(options: any = null): ModuleWithProviders {
        let config = new Config;
        let ngkit = new ngKit(config, options);

        return {
            ngModule: ngKitModule
        }
    }
}
