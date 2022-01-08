import { GameController } from '@/services/game';
import { Socket } from 'socket.io';

export const handleSocketRequest = <Req, Res>(
  socket: Socket,
  game: GameController,
  event: string,
  handler: (req: Req, socket: Socket, game: GameController) => Promise<Res> | Res
) => {
  socket.on(event, async (d) => {
    try {
      const response = await handler(d, socket, game);

      socket.emit(event, response);
    } catch (err) {
      socket.emit('error', { error: err });
    }
  });
};
