const { getGameStatus } = require("../state/util");

/*
 * Import evaluator functions
 */
const evaluatorFuncs = require("./funcs");

// fallback function does nothing to the room
const fallbackEvaluatorFunc = () => null;

/*
 * Action evaluator
 * returns null if the action is invalid or move is not allowed,
 * and a new state if it's valid and the room should be updated.
 */
const evaluator = (room, action) => {
  const currentGameStatus = getGameStatus(room);

  // get the evaluator function that matches the current game status
  // but get the fallback function if one is not defined
  const evaluatorFunc =
    evaluatorFuncs[currentGameStatus] || fallbackEvaluatorFunc;

  // call the evaluator function and return its value
  return evaluatorFunc(room, action);
};

module.exports = evaluator;
