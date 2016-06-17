import {Injectable} from '@angular/core';
import {Config} from './config';

@Injectable()
export class ngKit {

    /**
     * Create a new ngKit Instance.
     *
     * @param  {Config} config
     */
    constructor(public config: Config) { }

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
