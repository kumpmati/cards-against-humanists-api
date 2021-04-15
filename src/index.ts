import { Server } from "boardgame.io/server";
import { v4 } from "uuid";
import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";
import { attachApiRoutes } from "./api";
import Database from "./db/db";
import { FirebaseConnector } from "./db/firebase";

const uuid = () => v4().slice(0, 5);

const start = async () => {
  const firebase = new FirebaseConnector();
  const database = new Database(firebase);
  database.init(DEFAULT_CONFIG);

  const server = Server({
    games: [Cahum],
    uuid,
  });

  attachApiRoutes(server.router);
  server.run(DEFAULT_CONFIG.port);
};
start();
