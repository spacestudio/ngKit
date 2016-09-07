import { Injectable, NgModule } from '@angular/core';
import { Config } from './config';

export * from './config';
export * from './services/index';
export * from './providers';
export * from './decorators/index';
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
// export function ngKitInit(options: any) {
//     let kit = new ngKit(new Config);
//     let config = kit.init(options);
//
//     let providers = [
//         { provide: ngKit, useValue: kit },
//         { provide: Config, useValue: config },
//     ];
//
//     @NgModule({
//         imports: [],
//         providers: [providers]
//     })
//     class ngKitModule { }
//
//     return ngKitModule;
// }
