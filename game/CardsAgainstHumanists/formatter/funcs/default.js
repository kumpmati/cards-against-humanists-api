/*
 * Default formatter function
 */
module.exports = (room, sid) => {
  const formattedData = { ...room.state };
  return formattedData;
};
