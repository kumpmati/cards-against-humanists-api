const playerNotFoundErr = {
  error: "NOT_FOUND",
  data: "Player not found",
};

const roomNotFoundErr = {
  error: "NOT_FOUND",
  data: "Room not found",
};

const roomAlreadyExistsErr = {
  error: "INVALID_INFO",
  data: "Room already exists",
};

const wrongPassErr = {
  error: "INVALID_INFO",
  data: "Wrong password",
};

const missingParamsErr = (...arr) => ({ error: "MISSING_PARAMS", data: arr });

module.exports = {
  playerNotFoundErr,
  roomNotFoundErr,
  wrongPassErr,
  missingParamsErr,
  roomAlreadyExistsErr,
};
