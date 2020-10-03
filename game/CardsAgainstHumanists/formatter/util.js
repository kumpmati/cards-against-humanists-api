/*
 * Player
 */
const getName = (player) => (player ? player.name : null);
const shortSid = (sid) => sid.slice(0, 4);

module.exports = { getName, shortSid };
