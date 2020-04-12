/**
 * Model for cache items.
 */
export class CacheItemModel {
  /**
   * When the cache item expires.
   */
  _expires: number;

  /**
   * The value of the cache item.
   */
  _value: any;

  /**
   * Construcotr.
   */
  constructor(item: any) {
    Object.assign(this, item);
  }

  /**
   * Get value accessor parses JSON.
   */
  get value(): any {
    return JSON.parse(this._value);
  }

  /**
   * Set the value mutator that stringifies value.
   */
  set value(value: any) {
    this._value = JSON.stringify(value);
  }

  /**
   * Get expires accessor.
   */
  get expires(): number {
    return this._expires;
  }

  /**
   * Set the expires mutator.
   */
  set expires(seconds: number) {
    let expiration = new Date();
    expiration.setSeconds(expiration.getUTCSeconds() + seconds);
    this._expires = expiration.getTime();
  }

  /**
   * Check if cached item is expired.
   */
  isExpired(): boolean {
    return this.expires <= new Date().getTime();
  }
}
