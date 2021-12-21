import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import { PORT } from 'src/config';

export const initExpress = async () => {
  const app = express();
  const http = new Server(app);

  http.listen(PORT, () => console.log('listening on port', PORT));
};
