import { DB } from "../db/db";
import { SetupData } from "./types";

export const validateSetupData = (setupData: any, numPlayers: number) => {
  if (!isSetupData(setupData)) {
    return "Setup data is malformed";
  }

  if (numPlayers < 2 || numPlayers > 50) {
    return "Number of players must be 2 <= x <= 50";
  }

  if (!DB.cardPacksExist(setupData.packs)) {
    return "Card pack does not exist";
  }
};

// type guard for SetupData
const isSetupData = (data: any): data is SetupData =>
  typeof data === "object" &&
  data.hasOwnProperty("packs") &&
  Array.isArray(data.packs) &&
  data.hasOwnProperty("numPlayers") &&
  typeof data.numPlayers === "number" &&
  data.hasOwnProperty("private") &&
  typeof data.private === "boolean" &&
  data.hasOwnProperty("shuffleAnswers") &&
  typeof data.shuffleAnswers === "boolean" &&
  data.hasOwnProperty("czarReveals") &&
  typeof data.czarReveals === "boolean";
