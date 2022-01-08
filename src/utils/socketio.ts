import { Socket } from 'socket.io';

export const handleRequest = <Req, Res>(
  socket: Socket,
  event: string,
  handler: (req: Req, socket: Socket) => Promise<Res> | Res
) => {
  socket.on(event, async (d) => {
    try {
      const response = await handler(d, socket);

      socket.emit(event, response);
    } catch (err) {
      console.error('error while handling websocket request:', err);
    }
  });
};
