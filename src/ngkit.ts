import { Injectable } from '@angular/core';
import { Config } from './config';

export * from './config';
export * from './services/index';
export * from './providers';
export * from './decorators/index';

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
