import { Ctx } from "boardgame.io";
import { PlayStages } from ".";
import { AnswerCard, CahumG, Card } from "../../types";

/**
 * Strips away any info that shouldn't be sent to players.
 * @param G
 * @param ctx
 * @param playerID
 */
export const playPlayerView = (G: CahumG, ctx: Ctx, playerID: string) => {
  const { table: originalTable, hands } = G;

  let formattedAnswers: AnswerCard[] = originalTable.answers.slice(0);

  if (G.currentStage === PlayStages.submitAnswer) {
    // don't show text on cards until all answers have been submitted
    formattedAnswers = formattedAnswers.map(hideCardText);
  }

  if (
    G.currentStage === PlayStages.chooseWinner ||
    G.currentStage === PlayStages.czarReveals
  ) {
    if (G.settings.czarReveals) {
      formattedAnswers = formattedAnswers.map((card) =>
        showCardIfRevealed(card, originalTable.revealed)
      );
    }
  }

  const strippedG = {
    table: { ...originalTable, answers: formattedAnswers },
    hand: hands[playerID],
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
