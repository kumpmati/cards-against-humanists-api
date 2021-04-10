import { Ctx } from "boardgame.io";
import { PlayStages } from "../game/phases/play";
import { CahumG } from "../game/types";

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
