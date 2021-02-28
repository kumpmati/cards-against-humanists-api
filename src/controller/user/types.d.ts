import { Socket } from "socket.io";

interface JoinGameEvent {}
interface LeaveGameEvent {}

interface SocketMessageEvent<T> {
  socket: Socket;
  message: T;
}
