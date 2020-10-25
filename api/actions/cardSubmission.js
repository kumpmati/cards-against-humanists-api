const { missingParamsErr, invalidCardsErr } = require("../../util/errors");

// must include sid, room_name and room_password
const validParams = data => !!data && !!data.cards;

const MAX_REQUIRED_CARDS = 3;
const MAX_TEXT_LENGTH = 100;

// CARD_SUBMISSION
function cardSubmission({ data, rtDB }) {
  if (!validParams(data)) {
    return missingParamsErr("cards");
  }
  const { cards } = data;

  // validate each card before adding them to the evaluation list
  if (!Array.isArray(cards) || cards.length === 0) {
    return invalidCardsErr("No cards submitted");
  }

  // database references
  const questionsRef = rtDB.db.collection(rtDB.config.questions);
  const answersRef = rtDB.db.collection(rtDB.config.answers);

  // validate all cards
  for (const card of cards) {
    // check that the card does not have any extra properties
    // besides the text and required cards
    const { text, required_cards, packs, ...rest } = card;
    if (Object.keys(rest).length > 0)
      return invalidCardsErr("Card(s) contain illegal properties");

    // text must not be empty
    if (!text || text.trim() === "")
      return invalidCardsErr("Text field is not present or is empty");

    // remove whitespace around card text
    card.text = text.trim();
    if (card.text.length > MAX_TEXT_LENGTH)
      return invalidCardsErr(
        `Card text is too long! (max ${MAX_TEXT_LENGTH} characters)`
      );

    // check if card contains packs
    if (!Array.isArray(packs)) card.packs = ["all"];

    if (required_cards) {
      card.required_cards = parseInt(required_cards);

      // required cards must be a valid number if present
      if (
        isNaN(card.required_cards) ||
        card.required_cards > MAX_REQUIRED_CARDS ||
        card.required_cards < 1
      )
        return invalidCardsErr("Number of required cards is not within limits");

      questionsRef.add(card);
    } else {
      answersRef.add(card);
    }
  }

  return { success: true };
}

module.exports = cardSubmission;
