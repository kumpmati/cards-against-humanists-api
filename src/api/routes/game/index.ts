import { Router } from "express";
import { createGame, gameExists, getGame } from "../../../service/game";
import {
  Cahum,
  isCahumCreateSettings,
  isCahumJoinOptions,
} from "../../../game/cahum";
import { createAuthToken, updateAuthToken } from "../../../service/auth";

/**
 * Route: /api/game
 */
export const gameRouter = Router();

/**
 * POST: /api/game/create
 */
gameRouter.post("/create", (req, res) => {
  if (!isCahumCreateSettings(req.body)) {
    res.json({ error: "invalid request" });
    return;
  }

  const opts = req.body;
  const game = createGame(Cahum, opts);

  try {
    const token = createAuthToken(game.getID()); // unique token to auth user when joining
    game.setHost(token.token);

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
    const { roomCode, token, password } = req.body;
    const game = getGame(roomCode);

    const gamePassword = game.getOptions().password;
    if (gamePassword && !password) {
      res.json({ action: "password_needed" });
      return;
    } else if (gamePassword && password !== gamePassword) {
      throw new Error("Invalid password");
    }

    const newToken = token
      ? updateAuthToken(token.token, game.getID())
      : createAuthToken(game.getID());

    res.json(newToken);
  } catch (e) {
    res.json({ error: e.message });
  }
});
