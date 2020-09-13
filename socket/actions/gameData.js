// GAME_DATA actions and response
module.exports = ({ data, gameHandler, socket }) => {
  // evaluate given data. newState is null if move is invalid
  const validState = gameHandler.evaluateData({
    room_name: data.room_name,
    data: data.data,
  });

  if (validState) {
    // prepare the response
    const response = {
      type: "GAME_DATA",
      data: validState,
      room_name: data.room_name,
    };

    // send the new state to all clients in the room EXCLUDING SENDER
    socket.to(data.room_name).emit("data", response);
    return response;
  }
  return { error: "INVALID_DATA" };
};
