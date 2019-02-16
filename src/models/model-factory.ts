import * as faker from 'faker';

export class ModelFactory {
  /**
   * Create a new instance of the model factory.
   */
  constructor(attributes?: any) {
    if (typeof attributes === 'string') {
      attributes = JSON.parse(attributes);
    }

    return Object.assign(this, attributes);
  }

  /**
   * The faker.js instance of the factory.
   */
  protected _faker = faker;
}
