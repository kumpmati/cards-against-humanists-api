import { Ctx } from "boardgame.io";
import { DB } from "../db";
import { PlayStages } from "../game/phases/play";
import { AnswerCard, CahumG, QuestionCard } from "../game/types";

/**
 * Helper function to calculate number of active players that are currently in the given stage
 * @param ctx Ctx
 * @param stage Stage name
 * @returns Number of players in that stage
 */
export const numPlayersAtStage = (ctx: Ctx, stage: string): number =>
  Object.values(ctx?.activePlayers || {}).filter((p) => p === stage).length;

export const setStage = (G: CahumG, stage: PlayStages) =>
  (G.state.stage = stage);

export const isAtStage = (G: CahumG, stage: PlayStages) =>
  G.state.stage === stage;

export const numAnswers = (G: CahumG) =>
  G.table.answers.reduce((sum, curr) => sum + curr.length, 0);

export const allCardsRevealed = (G: CahumG) => {
  const answers = numAnswers(G);
  return answers > 0 && answers === G.table.revealed.length;
};

export const getAnswers = (G: CahumG, num: number) => {
  const query = DB.getCards<AnswerCard>({
    type: "answer",
    n: num,
    startIndex: G.db.answerDeckIndex,
    packs: G.settings.packs,
  });

  G.db.answerDeckIndex = query.newIndex;
  return query.cards;
};

export const getQuestions = (G: CahumG, num: number) => {
  const query = DB.getCards<QuestionCard>({
    type: "question",
    n: num,
    startIndex: G.db.questionDeckIndex,
    packs: G.settings.packs,
  });

  G.db.questionDeckIndex = query.newIndex;
  return query.cards;
};
