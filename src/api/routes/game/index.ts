import express, { Router } from "express";
import { createGame, getGame } from "../../../game";
import {
  Cahum,
  isCahumCreateOptions,
  isCahumJoinOptions,
} from "../../../game/cahum";
import { createAuthToken } from "../../../service/auth";

/**
 * Route: /api/game
 */
export const gameRouter = Router();

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

  try {
    const token = createAuthToken(game.getID()); // unique token to auth user when joining
    res.json(token);
  } catch (e) {
    res.json({ error: e.message });
  }
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
    const game = getGame(req.body.roomCode);
    res.json({ join: game.getID() });
  } catch (e) {
    res.json({ error: e.message });
  }
});
