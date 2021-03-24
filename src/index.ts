import { Server } from "boardgame.io/server";
import { DEFAULT_CONFIG } from "../OLD/config";
import { Cahum } from "./game";

const server = Server({ games: [Cahum] });
server.run(DEFAULT_CONFIG.port);
