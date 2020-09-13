// cards against humanists rule evaluator
const initialState = {
  used_cards: [],
  players: [],
};

const evaluate = (currentState, data) => {
  const newState = data;
  console.log("evaluated cards against humanists data:", data);
  return newState;
};

const sanitize = (data, session_id) => {
  return { ...data, targetId: session_id };
};

module.exports = { initialState, evaluate, sanitize };
