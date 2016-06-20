import {Injectable} from '@angular/core';
import {ngKitConfig} from './config';

@Injectable()
export class ngKit {

    /**
     * Create a new ngKit Instance.
     *
     * @param  {Config} config
     */
    constructor(public config: ngKitConfig) { }

    /**
     * Initialize ngKit with configurable options.
     *
     * @param  {Object} options
     * @return {ngKit}
     */
    init(options: Object): ngKit {
        this.config.setOptions(options);

        return this;
    }
}
