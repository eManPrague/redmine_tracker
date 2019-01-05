/**
 * Slice keys from object.
 */
module.exports = function sliceKeys(obj, keys) {
  const reduced = {};

  keys.forEach(key => {
    reduced[key] = obj[key];
  });

  return JSON.stringify(reduced);
};
