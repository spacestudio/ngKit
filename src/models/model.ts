export class Model {
    /**
     * Create a new instance of the mdoel.
     *
     * @param  {any} attributes
     */
    constructor(attributes?: any) {
        if (typeof attributes === 'string') {
            attributes = JSON.parse(attributes);
        }

        Object.assign(this, attributes);
    }
}
