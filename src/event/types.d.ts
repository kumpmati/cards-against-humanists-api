export type Handler<T> = (data: T) => any;

export interface Event<T> {
  on: (handler: (data: T) => any) => any;
  off: (handler: (data: T) => any) => any;
}

export interface TypedEvent<E, T> {
  on: (event: E, handler: Handler<T>) => any;
  off: (event: E, handler: Handler<T>) => any;
}
