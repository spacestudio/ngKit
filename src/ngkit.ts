import {
    Injectable, NgModule, Inject, ModuleWithProviders, OpaqueToken, Optional
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { NGKIT_PROVIDERS } from './providers';
import { Config } from './config';

export class ngKitOptions { }

@Injectable()
export class ngKit {
    /**
     * Create a new ngKit Instance.
     *
     * @param  {object} options
     * @param  {Config} config
     */
    constructor(public config: Config, @Optional() options: ngKitOptions) {
        this.config.setOptions(options);
    }
}

@NgModule({
    imports: [HttpModule],
    exports: [HttpModule],
    providers: [
        ngKit,
        ...NGKIT_PROVIDERS,
    ]
})
export class ngKitModule {
    /**
     * ngKit module initializer.
     *
     * @param  {any} options
     * @return {ngKitModule}
     */
    static forRoot(options: ngKitOptions): ModuleWithProviders {
        return {
            ngModule: ngKitModule,
            providers: [
                { provide: ngKitOptions, useValue: options },
            ]
        }
    }
}
