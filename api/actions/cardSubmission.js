const { parse } = require("uuid");
const { missingParamsErr, invalidCardsErr } = require("../../util/errors");

// must include sid, room_name and room_password
const validParams = data => !!data && !!data.cards;

// CARD_SUBMISSION
function cardSubmission({ data, rtDB }) {
  if (!validParams(data)) {
    return missingParamsErr("cards");
  }
  const submissionRef = rtDB.db.collection(rtDB.config.submittedCards);
  const { cards } = data;

  // validate each card before adding them to the evaluation list
  if (!Array.isArray(cards) || cards.length === 0) {
    return invalidCardsErr("No cards submitted");
  }

  // validate all cards
  for (const card of cards) {
    // check that the card does not have any extra properties
    // besides the text and required cards
    const { text, required_cards, packs, ...rest } = card;
    if (Object.keys(rest).length > 0)
      return invalidCardsErr("Card(s) contain illegal properties");

    // text must not be empty
    if (!card.hasOwnProperty("text") || card.text.trim() === "")
      return invalidCardsErr("Text field is not present or is empty");

    // remove whitespace around card text
    card.text = card.text.trim();
    if (!Array.isArray(packs)) card.packs = ["all"];

    if (card.required_cards) {
      card.required_cards = parseInt(card.required_cards);
      // required cards must be a valid number if present
      if (isNaN(card.required_cards))
        return invalidCardsErr("Required cards field is not a valid number");
    }

    // add card to db
    submissionRef.add(card);
  }

  return { success: true };
}

module.exports = cardSubmission;
