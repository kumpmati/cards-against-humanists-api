import { AnswerCard, QuestionCard } from '@/types/cards';
import {
  Game,
  GameEvent,
  GameSettings,
  GameStateStatus,
  GameTable,
  Player,
  Spectator,
} from '@/types/game';
import { randomUUID } from 'crypto';

type CallbackFunc = (state: Game) => void | Promise<void>;

export class GameController {
  readonly id: string;
  private settings: GameSettings;
  private players: Player[];
  private spectators: Spectator[];
  private czar: string | null;
  private hands: Record<string, AnswerCard[]>;
  private table: GameTable;
  private round: number;
  private status: GameStateStatus;
  private deck: {
    answers: AnswerCard[];
    questions: QuestionCard[];
  };
  private listeners: Record<string, CallbackFunc[]>;

  constructor(id: string, settings: GameSettings) {
    this.id = id;
    this.settings = settings;
    this.czar = null;
    this.players = [];
    this.spectators = [];
    this.round = 0;
    this.hands = {};
    this.status = 'IN_LOBBY';
    this.table = {
      question: null,
      answers: [],
    };
    this.deck = {
      answers: [],
      questions: [],
    };
    this.listeners = {};
  }

  /**
   * Resets all of the game's state variables
   */
  reset() {
    this.status = 'IN_LOBBY';
    this.round = 0;
    this.hands = {};
    this.table = {
      question: null,
      answers: [],
    };
    this.deck = {
      answers: [],
      questions: [],
    };
  }

  /**
   * Returns the whole state of the game
   */
  private getState(): Game {
    return {
      id: this.id,
      players: this.players,
      spectators: this.spectators,
      host: this.settings.host,
      state: {
        status: this.status,
        czar: this.czar,
        deck: this.deck,
        hands: this.hands,
        round: this.round,
        roundEndTime: new Date().getTime(),
        table: this.table,
      },
    };
  }

  /**
   * Adds a player to the game
   */
  addPlayer(password: string | undefined, nickname: string): Player | null {
    if (this.settings.password && this.settings.password !== password) {
      throw new Error('invalid password');
    }

    if (this.players.some((p) => p.nickname === nickname)) {
      throw new Error('nickname taken');
    }

    const player: Player = {
      id: randomUUID(),
      token: randomUUID(),
      nickname,
      score: 0,
    };

    this.players.push(player);

    return player;
  }

  /**
   * Emits an event, calling all listeners with the current game state
   */
  private _emit(event: GameEvent) {
    const state = this.getState();

    if (!this.listeners[event]) return;

    for (const listener of this.listeners[event]) {
      listener(state);
    }
  }

  /**
   * Attaches an event listener to an event
   * @param event Event
   * @param cb Callback to be executed
   */
  on(event: GameEvent, cb: CallbackFunc) {
    if (!this.listeners[event]) this.listeners[event] = [];

    this.listeners[event].push(cb);
  }

  /**
   * Detaches an event listener from an event
   * @param event Event
   * @param cb Callback to detach
   */
  off(event: GameEvent, cb: CallbackFunc) {
    if (!this.listeners[event]) return;

    this.listeners[event].splice(this.listeners[event].indexOf(cb), 1);
  }
}
