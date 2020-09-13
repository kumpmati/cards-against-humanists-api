// returns true if object contains a key, false if not or if obj is null or undefined
const hasKey = (obj, key) =>
  !!obj ? Object.keys(obj).indexOf(key) > -1 : false;

module.exports = {
  hasKey,
};
