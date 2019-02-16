export class Model {
  /**
   * Create a new instance of the model.
   */
  constructor(attributes?: any) {
    if (typeof attributes === 'string') {
      attributes = JSON.parse(attributes);
    }

    Object.assign(this, attributes);
  }
}
