import { Injectable } from '@angular/core';
import { Config } from '../../config';
import * as LocalForage from "localforage";
import { StorageDriver } from './storage-driver';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable()
export class LocalStorage implements StorageDriver {
  /**
   * The driver of the storage provider.
   */
  driver: LocalForage = null;

  /**
   * The load promise.
   */
  load: Promise<any>;

  /**
   * Create a new instance of the service.
   */
  constructor(private config: Config) {
    this.load = new Promise((resolve) => {
      if (this.driver || typeof window === 'undefined') {
        return resolve(this.driver);
      }

      LocalForage.defineDriver(CordovaSQLiteDriver).then(() => {
        this.driver = LocalForage.createInstance({
          name: this.config.get('storage.name')
        });
      }).then(() => {
        this.driver.setDriver([
          CordovaSQLiteDriver._driver,
          LocalForage.INDEXEDDB,
          LocalForage.LOCALSTORAGE,
        ]);
      }).then(() => {
        return resolve(this.driver);
      }).catch(e => {
        console.log(e);
      });
    });
  }

  /**
   * Get item from local storage.
   */
  async get(key: string): Promise<any> {
    await this.load;

    if (this.driver) {
      return await this.driver.getItem(key);
    }
  }

  /**
   * Set an item to local storage.
   */
  async set(key: string, value: any): Promise<any> {
    await this.load;

    if (this.driver) {
      return await this.driver.setItem(key, value);
    }
  }

  /**
   * Remove an item from local storage.
   */
  async remove(key: string): Promise<void> {
    await this.load;

    if (this.driver) {
      return await this.driver.removeItem(key);
    }
  }

  /**
   * Clear local storage.
   */
  async clear(): Promise<void> {
    await this.load;

    if (this.driver) {
      return await this.driver.clear();
    }
  }
}
