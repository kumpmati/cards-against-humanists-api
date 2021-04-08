import { DB } from "../db";
import { SetupData } from "./types";

export const validateSetupData = (setupData: any, numPlayers: number) => {
  if (!isSetupData(setupData)) return "Setup data is malformed";

  if (numPlayers < 2 || numPlayers > 100)
    return "Number of players must be 2 <= x <= 100";

  try {
    DB.getCards(setupData.packs); // check that all card packs are valid
  } catch (e) {
    return e.message;
  }
};

// type guard for SetupData
const isSetupData = (data: any): data is SetupData =>
  typeof data === "object" &&
  data.hasOwnProperty("packs") &&
  Array.isArray(data.packs) &&
  data.hasOwnProperty("maxPlayers") &&
  typeof data.maxPlayers === "number" &&
  data.hasOwnProperty("shuffleAnswers") &&
  typeof data.shuffleAnswers === "boolean" &&
  data.hasOwnProperty("czarReveals") &&
  typeof data.czarReveals === "boolean";
