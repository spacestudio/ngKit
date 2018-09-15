import { Injectable, Inject } from '@angular/core';
import { Config } from '../../config';
import { CookieStorage as cookieStorage, parseCookies } from 'cookie-storage';
import { StorageDriver } from './storage-driver';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable()
export class CookieStorage implements StorageDriver {
    /**
     * The database of the storage provider.
     */
    db: any;

    /**
     * Create a new instance of the service.
     *
     * @param config
     * @param request
     */
    constructor(
        private config: Config,
        @Inject('REQUEST') private request: any
    ) {
        this.db = new cookieStorage({
            'secure': this.config.get('cookies.secure', true),
        });
    }

    /**
     * Get item from local storage.
     */
    get(key: string): Promise<any> {
        if (this.request && this.request.cookie) {
            const parsed = parseCookies(this.request.cookie);

            if (parsed && parsed.hasOwnProperty(key)) {
                return Promise.resolve(parsed[key]);
            }
        }

        return Promise.resolve(this.db.getItem(key));
    }

    /**
     * Set an item to local storage.
     *
     * @param  key
     * @param  value
     */
    set(key: string, value: any): Promise<any> {
        return Promise.resolve(this.db.setItem(key, value));
    }

    /**
     * Remove an item from local storage.
     *
     * @param   key
     */
    remove(key: string): Promise<any> {
        return Promise.resolve(this.db.removeItem(key));
    }

    /**
     * Clear local storage.
     */
    clear(): Promise<any> {
        return Promise.resolve(this.db.clear());
    }
}
