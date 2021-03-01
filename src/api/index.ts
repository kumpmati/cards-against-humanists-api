import { Router } from "express";
import { gameRouter } from "./routes/game";

/**
 * Route: /api
 */
export const apiRoutes = Router();

/**
 * Route: /api/game
 */
apiRoutes.use("/game", gameRouter);
