import express, { Router } from "express";

/**
 * Route: /api/game
 */
export const gameRouter = Router();
gameRouter.use(express.json());

/**
 * POST: /api/game/create
 */
gameRouter.post("/create", (req, res) => {
  const data = req.body;
});

/**
 * POST: /api/game/join
 */
gameRouter.post("/join", (req, res) => {
  res.json({ join: "success" });
});
