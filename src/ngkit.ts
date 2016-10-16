import {
    Injectable, NgModule, Inject, ModuleWithProviders, OpaqueToken
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { NGKIT_PROVIDERS } from './providers';
import { Config } from './config';

export const ngKitOptions = new OpaqueToken('NGKITOPTIONS');

@Injectable()
export class ngKit {
    /**
     * Create a new ngKit Instance.
     *
     * @param  {object} options
     * @param  {Config} config
     */
    constructor(public config: Config, public options: OpaqueToken) {
        this.config.setOptions(options);
    }

    /**
     * Initialize with options.
     *
     * @param  {any} options
     * @return {void}
     */
    init(options: any = null): void {
        this.config.setOptions(options);
    }
}

@NgModule({
    imports: [HttpModule],
    exports: [HttpModule]
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
                { provide: ngKit, useClass: ngKit, deps: [Config, ngKitOptions] },
                ...NGKIT_PROVIDERS,
            ]
        }
    }
}
