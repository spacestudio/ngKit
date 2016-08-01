/**
 * Model for cache items.
 */
export class CacheItemModel {
    /**
     * When the cache item expires.
     *
     * @type {number}
     */
    _expires: number;

    /**
     * The value of the cache item.
     *
     * @type {any}
     */
    _value: any;

    /**
     * Construcotr.
     *
     * @param  {any} item
     * @param  {number} expires
     */
    constructor(item: any) {
        Object.assign(this, item)
    }

    /**
     * Get value accessor parses JSON.
     *
     * @return {any}
     */
    get value(): any {
        return JSON.parse(this._value);
    }

    /**
     * Set the value mutator that stringifies value.
     *
     * @param  {any} value
     */
    set value(value: any) {
        this._value = JSON.stringify(value);
    }

    /**
     * Get expires accessor.
     *
     * @return {any}
     */
    get expires(): number {
        return this._expires;
    }

    /**
     * Set the expires mutator.
     *
     * @param  {number} minutes
     */
    set expires(minutes: number) {
        let expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + minutes);
        this._expires = expiration.getTime();
    }

    /**
     * Check if cached item is expired.
     *
     * @return {boolean} [description]
     */
    isExpired(): boolean {
        return this.expires <= new Date().getTime();
    }
}
