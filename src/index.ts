//import admin from "firebase-admin";
//import { Firestore } from "bgio-firebase";
import { Server } from "boardgame.io/server";
import { v4 } from "uuid";

import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";

/*
const database = new Firestore({
  config: {
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://cahum-2f40d.firebaseio.com",
  },
  dbPrefix: "cahum_",
});
*/

const server = Server({
  games: [Cahum],
  uuid: () => v4().slice(0, 5),
  //db: database,
});

server.run(DEFAULT_CONFIG.port);
