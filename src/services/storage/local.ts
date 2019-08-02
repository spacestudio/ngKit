import { Injectable } from '@angular/core';
import { Config } from '../../config';
import * as LocalForage from "localforage";
import { StorageDriver } from './storage-driver';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable()
export class LocalStorage implements StorageDriver {
  /**
   * The database of the storage provider.
   */
  db: LocalForage;

  /**
   * The load promise.
   */
  load: Promise<any>;

  /**
   * Create a new instance of the service.
   */
  constructor(private config: Config) {
    this.load = new Promise((resolve) => {
      if (this.db) {
        return resolve(this.db);
      }

      LocalForage.defineDriver(CordovaSQLiteDriver).then(() => {
        this.db = LocalForage.createInstance({
          name: this.config.get('storage.name')
        });
      }).then(() => {
        this.db.setDriver([
          CordovaSQLiteDriver._driver,
          LocalForage.INDEXEDDB,
          LocalForage.LOCALSTORAGE,
        ]);
      }).then(() => {
        return resolve(this.db);
      });
    });
  }

  /**
   * Get item from local storage.
   */
  get(key: string): Promise<any> {
    this.load;

    return this.db.getItem(key);
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any): Promise<any> {
    this.load;

    return this.db.setItem(key, value);
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<void> {
    await this.load;

    return this.db.removeItem(key);
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<void> {
    this.load;

    return this.db.clear();
  }
}
