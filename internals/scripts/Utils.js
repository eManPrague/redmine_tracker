// @flow

/**
 * Slice keys from object.
 */
const sliceKeys = (obj: any, keys: Array<string>) => {
  const reduced = {};

  keys.forEach(key => {
    reduced[key] = obj[key];
  });

  return JSON.stringify(reduced);
};

export default sliceKeys;
