import {
    Injectable, NgModule, Inject, ModuleWithProviders, OpaqueToken
} from '@angular/core';
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

/**
 * The options for the module.
 *
 * @param  {any} options
 * @return {any}
 */
export function ngKitOptionsFactory(options: any): any {
    return options;
}

// export const ngKitOptions = new OpaqueToken('NGKITOPTIONS');

@NgModule({
    // imports: [HttpModule],
    // exports: [HttpModule]
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
                // { provide: ngKitOptions, useFactory: ngKitOptionsFactory, deps: [options] },
                //{ provide: ngKit, useClass: ngKit, deps: [Config, options] },
                ...NGKIT_PROVIDERS,
            ]
        }
    }
}
