import { Server } from "boardgame.io/server";
import { v4 } from "uuid";
import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";
import { attachApiRoutes } from "./api";
import { DB } from "./db";
import { DiskConnector } from "./db/connectors/disk";
import { FirebaseConnector } from "./db/connectors/firebase";

const uuid = () => v4().slice(0, 5);

const start = async () => {
  // use disk when in development
  DB.use(DEFAULT_CONFIG.dev ? new DiskConnector() : new FirebaseConnector());
  await DB.init(DEFAULT_CONFIG);

  const server = Server({
    games: [Cahum],
    uuid,
  });

  attachApiRoutes(server.router);
  server.run(DEFAULT_CONFIG.port);
};
start();
