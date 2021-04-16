import { Server } from "boardgame.io/server";
import { v4 } from "uuid";
import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";
import { attachApiRoutes } from "./api";
import { DB } from "./db";
import { FirebaseConnector } from "./db/connectors/firebase";
import { DevConnector } from "./db/connectors/dev";

const uuid = () => v4().slice(0, 5);

const start = async () => {
  const firebase = new FirebaseConnector();

  // use dev connector when in dev mode. This
  DB.use(DEFAULT_CONFIG.dev ? new DevConnector(firebase) : firebase);
  await DB.init(DEFAULT_CONFIG);

  const server = Server({
    games: [Cahum],
    uuid,
  });

  attachApiRoutes(server.router);
  server.run(DEFAULT_CONFIG.port);
};
start();
