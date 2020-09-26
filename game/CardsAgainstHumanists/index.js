/*
 * State
 */
const state = require("./state");

/*
 * Data evaluator
 */
const evaluator = require("./evaluator");

/*
 * Data formatter
 */
const formatter = require("./formatter");

/*
 * Game info
 */
const info = {
  name: "Cards Against Humanists",
  version: "0.0.1",
};

module.exports = { state, evaluator, formatter, info };
