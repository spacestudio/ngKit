import {Injectable} from '@angular/core';
import {ngKitConfig} from './config';

export * from './config';
export * from './services';
export * from './providers';

@Injectable()
export class ngKit {
    /**
     * Create a new ngKit Instance.
     *
     * @param  {object} options
     * @param  {Config} config
     */
    constructor(private config: ngKitConfig) { }

    /**
     * Initialize ngKit with configurable options.
     *
     * @param  {object} options
     * @return {ngKitConfig}
     */
    init(options: any): ngKitConfig {
        return this.config.setOptions(options);
    }
}
