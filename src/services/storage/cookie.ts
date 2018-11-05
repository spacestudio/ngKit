import { Injectable, Injector } from '@angular/core';
import { Config } from '../../config';
import { CookieStorage as CookieStore, parseCookies } from 'cookie-storage';
import { StorageDriver } from './storage-driver';

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
        private injector: Injector
    ) {
        this.db = new CookieStore({
            'path': this.config.get('cookies.path', '/'),
            'sameSite': this.config.get('cookies.sameSite', 'Strict'),
            'secure': this.config.get('cookies.secure', true),
        });
    }

    /**
     * Get item from local storage.
     */
    get(key: string): Promise<any> {
        const request = this.injector.get('REQUEST', {});

        if (request && request.headers && request.headers.cookie) {
            const parsed = parseCookies(request.headers.cookie);

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
