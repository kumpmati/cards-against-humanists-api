import { readFile } from "fs/promises";
import { CardPack } from "../../game/types";

export const loadCardsFromDisk = async (path: string) => {
  const rawData = (await readFile(path)).toString();
  const data = JSON.parse(rawData);

  if (!data.packs)
    throw new Error(
      "Invalid file format. JSON should contain key 'packs' of type CardPack[]"
    );
  return data.packs as CardPack[];
};
