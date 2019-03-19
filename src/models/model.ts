export class Model {
  /**
   * Create a new instance of the model.
   */
  constructor(attributes?: any) {
    if (attributes instanceof this.constructor) {
      return Object.assign(this, attributes);
    }

    if (typeof attributes === 'string') {
      attributes = JSON.parse(attributes);
    }

    Object.assign(this, attributes);
  }
}
