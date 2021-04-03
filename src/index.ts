import { Server } from "boardgame.io/server";
import { v4 } from "uuid";

import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";
import { DB } from "./db";

const start = async () => {
  const server = Server({
    games: [Cahum],
    uuid: () => v4().slice(0, 5),
  });

  await DB.load();

  server.run(DEFAULT_CONFIG.port);
};

start();

/*
const database = new Firestore({
  config: {
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://cahum-2f40d.firebaseio.com",
  },
  dbPrefix: "cahum_",
});
*/
