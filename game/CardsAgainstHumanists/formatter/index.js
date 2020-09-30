const { getGameStatus } = require("../state/util");

/*
 * Formatter functions
 */
const formatterFuncs = require("./funcs");

/*
 * Formatter is called whenever the room state is sent to the player.
 * It should remove any data that should not be shown to the player,
 * e.g. other players' cards or session ids
 */
const formatter = (room, sid) => {
	const currentGameStatus = getGameStatus(room);

	// get the formatter function matching the current game status
	// and fallback to the default formatter if not defined
	const formatterFunc =
		formatterFuncs[currentGameStatus] || formatterFuncs.default;

	// call the formatter and return the result
	return formatterFunc(room, sid);
};

module.exports = formatter;
