import express, { Router } from "express";
import { createGame, getGame } from "../../../game";
import {
  Cahum,
  isCahumCreateOptions,
  isCahumJoinOptions,
} from "../../../game/cahum";

/**
 * Route: /api/game
 */
export const gameRouter = Router();
gameRouter.use(express.json());

/**
 * POST: /api/game/create
 */
gameRouter.post("/create", (req, res) => {
  if (!isCahumCreateOptions(req.body)) {
    res.json({ error: "invalid request" });
    return;
  }

  const opts = req.body;
  const game = createGame(Cahum, opts);

  console.log(game);
  res.json({ roomCode: game.getID() });
});

/**
 * POST: /api/game/join
 */
gameRouter.post("/join", (req, res) => {
  if (!isCahumJoinOptions(req.body)) {
    res.json({ error: "invalid request" });
    return;
  }

  try {
    const opts = req.body;
    const game = getGame(opts.id);

    console.log(game);
    res.json({ join: "success" });
  } catch (e) {
    console.error(e);
    res.json({ error: "Game not found" });
  }
});
