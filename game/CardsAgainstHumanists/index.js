/*
 * State management
 */
const state = require("./state");

/*
 * Data evaluator function
 */
const evaluator = require("./evaluator");

/*
 * Data formatter function
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
