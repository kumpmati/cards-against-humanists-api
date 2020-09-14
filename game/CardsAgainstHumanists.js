const info = {
  name: "Cards Against Humanists",
  short_name: "CAHu",
};

// cards against humanists rule evaluator
const initialState = {
  used_cards: [],
};

const evaluate = (currentState, data) => {
  const newState = data;
  console.log("cards against humanists evaluator:", data);
  return newState;
};

const sanitize = (data, sid) => {
  console.log("cards against humanists sanitizer");
  return { ...data, targetId: sid };
};

module.exports = { initialState, evaluate, sanitize, info };
