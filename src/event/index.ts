import {
  Event as EventInterface,
  Handler,
  TypedEvent as TypedEventInterface,
} from "./types";

export class Event<T> implements EventInterface<T> {
  private handlers = new Set<Handler<T>>();

  public on = (handler: Handler<T>): void => {
    this.handlers.add(handler);
  };

  public off = (handler: Handler<T>): void => {
    this.handlers.delete(handler);
  };

  public trigger = (data?: T): void => {
    this.handlers.forEach(handler => {
      handler(data);
    });
  };

  public expose = (): Event<T> => this;
}

export class TypedEvent<E, T> implements TypedEventInterface<E, T> {
  private handlers = new Map<E, Set<Handler<T>>>();

  public on = (event: E, handler: Handler<T>): void => {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    const _set = this.handlers.get(event);
    _set.add(handler);
  };

  public off = (event: E, handler: Handler<T>): void => {
    const _set = this.handlers.get(event);
    if (!_set) return;

    _set.delete(handler);
  };

  public trigger = (event: E, data?: T): void => {
    const _set = this.handlers.get(event);
    if (!_set) return;

    _set.forEach(handler => {
      handler(data);
    });
  };

  public expose = (): TypedEvent<E, T> => this;
}
