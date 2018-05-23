import * as moment from 'moment';

export class Model {
    /**
     * Create a new instance of the mdoel.
     *
     * @param  attributes
     */
    constructor(attributes?: any) {
        if (typeof attributes === 'string') {
            attributes = JSON.parse(attributes);
        }

        Object.assign(this, attributes);
    }

    /**
     * Moment JS
     *
     * @return moment
     */
    moment = moment;
}
