import { Ctx } from "boardgame.io";
import { PlayStages } from ".";
import { AnswerCard, CahumG, CahumGClient, Card } from "../../types";

/**
 * Strips away any info that shouldn't be sent to players.
 * @param G
 * @param ctx
 * @param playerID
 */
export const playPlayerView = (
  G: CahumG,
  ctx: Ctx,
  playerID: string
): CahumGClient => {
  const { table: originalTable, hands, points, state, settings } = G;

  let formattedAnswers: AnswerCard[] = originalTable.answers.slice(0);

  if (state.stage === PlayStages.submitAnswer) {
    // don't show text on cards until all answers have been submitted
    formattedAnswers = formattedAnswers.map(hideCardText);
  }

  if (
    state.stage === PlayStages.chooseWinner ||
    state.stage === PlayStages.czarReveals
  ) {
    if (G.settings.czarReveals) {
      formattedAnswers = formattedAnswers.map((card) =>
        showCardIfRevealed(card, originalTable.revealed)
      );
    }
  }

  const strippedG: CahumGClient = {
    table: { ...originalTable, answers: formattedAnswers },
    hand: hands[playerID],
    state,
    settings,
    points,
  };

  return strippedG;
};

const showCardIfRevealed = (card: AnswerCard, revealed: AnswerCard[]) => {
  const isRevealed = revealed.find((o) => o.id === card.id);

  return isRevealed ? card : hideCardText(card);
};

/**
 * Helper to remove text from a card
 * @param card
 * @returns Copy of card with an empty string as text
 */
const hideCardText = <T extends Card>(card: T): T => ({
  ...card,
  text: "",
});
