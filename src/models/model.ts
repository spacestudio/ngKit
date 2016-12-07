export class Model {
    /**
     * Create a new instance of the model.
     *
     * @param  {any} attributes
     */
    constructor(attributes: any = {}) {
        Object.assign(this, attributes);
    }
}
