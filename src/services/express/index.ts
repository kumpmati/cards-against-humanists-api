import { PORT } from '@/config';
import { apiRouter } from '@/routes';
import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import { database } from '../database';
import { initSocketIO } from '../socketio';

export const initExpress = async () => {
  const app = express();
  const http = new Server(app);

  await database.init();
  initSocketIO(http);
  app.use(express.json());
  app.use(cors());
  app.use('/api', apiRouter);

  http.listen(PORT, () => console.log('listening on port', PORT));
};
