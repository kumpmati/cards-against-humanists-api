/*
 * Evaluator for the CZAR_CHOOSES_WINNER game state
 */
module.exports = (room, action) => {
  const { data, sid } = action;
  // only the czar is allowed to do anything
  console.log("czar chooses winner");
  return null;
};
