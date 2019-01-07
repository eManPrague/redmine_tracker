import storage from 'electron-json-storage';

export default class SettingsStorage {
  /**
   * Get value for key.
   *
   * @param key {String}
   * @param defaults {Object}
   * @return {Promise}
   *
   */
  static get(key: string, defaults: any = null): any {
    return new Promise((resolve, reject) => {
      const promise = this.hasKey(key);
      promise.then(val => {
        if (val) {
          return SettingsStorage.getKey(key);
        }

        return defaults;
      })
        .then(val => resolve(val))
        .catch(error => reject(error));
    });
  }

  /**
   * Set value to cache.
   *
   * @static
   * @param {String} key storage key
   * @param {String} value storage value
   * @returns Promise
   *
   * @memberOf SettingsStorage
   */
  static set(key: string, value: any) {
    return new Promise((resolve, reject) => {
      storage.set(key, value, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Override methods to return promise
   * instead of call cb
   */
  static getKey(key: string) {
    return new Promise((resolve, reject) => {
      storage.get(key, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  static hasKey(key: string) {
    return new Promise((resolve, reject) => {
      storage.has(key, (error: any, hasKey: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(hasKey);
        }
      });
    });
  }
}
