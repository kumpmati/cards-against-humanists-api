import { Ctx } from "boardgame.io";
import { assignRandomID, shuffle } from "../../../util";
import { DB } from "../../../db";
import { DBRequest } from "../../../db/types";
import { PlayStages } from ".";
import { AnswerCard, CahumG, Card, QuestionCard } from "../../types";

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

/**
 * Returns fresh answer cards from the deck
 * and updates G.db.answerDeckIndex accordingly
 * @param G
 * @param num
 * @returns
 */
export const getAnswers = (G: CahumG, num: number): AnswerCard[] => {
  try {
    const opts: DeckOpts = {
      n: num,
      type: "answer",
      startIndex: G.db.answerDeckIndex,
      packs: G.settings.packs,
      seed: G.db.seed,
    };

    const res = getCardsFromDeck<AnswerCard>(opts);

    G.db.answerDeckIndex = res.newIndex;
    return res.cards;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

/**
 * Returns fresh question cards from the deck
 * and updates G.db.questionDeckIndex accordingly
 * @param G
 * @param num
 * @returns
 */
export const getQuestions = (G: CahumG, num: number): QuestionCard[] => {
  try {
    const opts: DeckOpts = {
      n: num,
      type: "question",
      startIndex: G.db.questionDeckIndex,
      packs: G.settings.packs,
      seed: G.db.seed,
    };

    const res = getCardsFromDeck<QuestionCard>(opts);

    G.db.questionDeckIndex = res.newIndex;
    return res.cards;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

/**
 * Helper function to get cards from a simulated shuffled deck.
 * @param G
 * @param opts
 * @returns
 */
const getCardsFromDeck = <T extends Card>(opts: DeckOpts) => {
  const unshuffled = DB.get<T>({ type: opts.type, packs: opts.packs });
  const shuffled = shuffle(unshuffled, opts.seed);

  const cards = [] as T[];
  for (let i = 0; i < opts.n; i++) {
    const index = (opts.startIndex + i) % shuffled.length;
    cards.push(shuffled[index]);
  }

  return {
    newIndex: opts.startIndex + opts.n,
    cards: cards.map(assignRandomID),
  };
};

interface DeckOpts {
  n: number;
  type: "answer" | "question";
  startIndex: number;
  packs: string[];
  seed: string;
}
