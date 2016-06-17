export declare class Token {
    /**
     * Name of token stored in local storage.
     *
     * @type {string}
     */
    protected _token: string;
    /**
     * Storage provider.
     *
     * @type {localStorage}
     */
    private _storage;
    constructor();
    /**
     * Get the token from local storage.
     * @param  {string} tokenName
     * @return {Promise}
     */
    get(tokenName?: string): Promise<any>;
    /**
     * Store the token in local storage.
     *
     * @param  {string} token
     * @param  {string} tokenName
     * @return {Promise}
     */
    set(token: string, tokenName?: string): Promise<any>;
    /**
     * Remove token from local storage.
     *
     * @param  {string}  tokenName
     * @return {boolean}
     */
    remove(tokenName?: string): boolean;
}
