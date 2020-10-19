/*
 * Actions
 */

const newSessionAction = require("./newSession");
const validateSessionAction = require("./validateSession");

const createRoomAction = require("./createRoom");
const joinRoomAction = require("./joinRoom");
const leaveRoomAction = require("./leaveRoom");

const getStateAction = require("./getState");
const sendActionAction = require("./sendAction");

const cardSubmissionAction = require("./cardSubmission");
const getDataAction = require("./getData");

const actions = {
  newSessionAction,
  validateSessionAction,

  createRoomAction,
  joinRoomAction,
  leaveRoomAction,

  getStateAction,
  sendActionAction,

  cardSubmissionAction,
  getDataAction,
};

/*
 * Message types
 */
const types = {
  NewSession: "NEW_SESSION",
  ValidateSession: "VALIDATE_SESSION",

  JoinRoom: "JOIN_ROOM",
  LeaveRoom: "LEAVE_ROOM",
  CreateRoom: "CREATE_ROOM",

  GetState: "GET_STATE",
  SendAction: "SEND_ACTION",
  Heartbeat: "HEARTBEAT", // debug

  CardSubmission: "CARD_SUBMISSION",
  GetData: "GET_DATA",
};

module.exports = { actions, types };
