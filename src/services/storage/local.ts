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
  db: any;

  /**
   * The load promise.
   */
  load: Promise<any>;

  /**
   * Create a new instance of the service.
   *
   * @param config
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
          LocalForage.WEBSQL,
          LocalForage.LOCALSTORAGE
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
    return this.load.then(() => this.db.getItem(key));
  }

  /**
   * Set an item to local storage.
   *
   * @param  key
   * @param  value
   */
  set(key: string, value: any): Promise<any> {
    return this.load.then(() => this.db.setItem(key, value));
  }

  /**
   * Remove an item from local storage.
   *
   * @param   key
   */
  remove(key: string): Promise<any> {
    return this.load.then(() => this.db.removeItem(key));
  }

  /**
   * Clear local storage.
   */
  clear(): Promise<any> {
    return this.load.then(() => this.db.clear());
  }
}
