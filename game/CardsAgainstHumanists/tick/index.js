const { getGameStatus } = require("../state/util");

/*
 * Tick functions
 */
const tickFuncs = require("./funcs");

// state is the current state of the room
// if the game needs to be updated, the function should return the new state
// if the game doesn't need updating this tick, then return null
const tick = (room) => {
  const status = getGameStatus(room);
  const tickFunc = tickFuncs[status] || (() => null);

  // call tick function
  return tickFunc(room);
};

module.exports = tick;
