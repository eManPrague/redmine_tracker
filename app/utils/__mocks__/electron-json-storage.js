// Custom storage class.
/* eslint-disable no-unused-vars */
class Storage {
  static set(key, value) {
    return new Promise((resolve, reject) => {
      resolve('OK');
    });
  }

  static get(key) {
    return new Promise((resolve, reject) => {
      resolve('OK');
    });
  }
}

export default Storage;
