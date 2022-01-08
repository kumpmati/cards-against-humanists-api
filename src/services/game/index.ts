import { AnswerCard, Card, QuestionCard } from '@/types/cards';
import {
  ServerGame,
  GameSettings,
  ServerGameState,
  ClientGame,
  ServerSpectator,
  ServerPlayer,
  ActionHandler,
} from '@/types/game';
import { randomUUID } from 'crypto';
import { chooseWinnerHandler } from './actions/chooseWinner';
import { revealCardHandler } from './actions/revealCard';
import { submitAnswerHandler } from './actions/submitAnswer';
import { shuffle } from 'shuffle-seed';

type CallbackFunc = (state: ClientGame) => void | Promise<void>;

export class GameController {
  readonly id: string;
  private settings: GameSettings;
  private players: ServerPlayer[];
  private spectators: ServerSpectator[];
  private state: ServerGameState;
  private deck: {
    answers: AnswerCard[];
    answerIndex: number;
    questions: QuestionCard[];
    questionIndex: number;
  };
  private listeners: Record<string, CallbackFunc[]>;

  constructor(id: string, settings: GameSettings, initialState?: ServerGameState) {
    this.id = id;
    this.settings = settings;
    this.state = {
      phase: 'WAITING_FOR_ANSWERS',
      czar: null,
      round: 0,
      phaseStartTime: new Date().getTime(),
      hands: {},
      table: {
        question: null,
        answers: {},
        revealed: [],
      },
    };
    this.players = [];
    this.spectators = [];

    this.deck = {
      answers: [],
      questions: [],
      answerIndex: 0,
      questionIndex: 0,
    };
    this.listeners = {};

    // override state with given state
    if (initialState) this._overrideState(initialState);
  }

  /**
   * Overrides current game state with the given state object.
   */
  private _overrideState(state: ServerGameState) {
    this.state = state;
  }

  /**
   * Resets all of the game's state variables
   */
  reset() {
    this.state = {
      czar: null,
      phase: 'IN_LOBBY',
      round: 0,
      phaseStartTime: new Date().getTime(),
      hands: {},
      table: {
        question: null,
        answers: {},
        revealed: [],
      },
    };
  }

  /**
   * Sets which cards the game has in use
   */
  setDeck(cards: { answers: AnswerCard[]; questions: QuestionCard[] }) {
    // shuffle cards using game ID as seed when loading (simulates shuffling the decks before the game)
    this.deck.answers = shuffle(cards.answers, this.id);
    this.deck.questions = shuffle(cards.questions, this.id);
    this.deck.answerIndex = 0;
    this.deck.questionIndex = 0;
  }

  /**
   * Returns basic info about the game
   */
  getInfo() {
    return {
      id: this.id,
      players: this.players.length,
      settings: this.settings,
    };
  }

  /**
   * Returns the whole state of the game
   */
  getState(): ServerGame {
    return {
      id: this.id,
      players: this.players,
      spectators: this.spectators,
      host: this.settings.host,
      state: this.state,
      deck: this.deck,
    };
  }

  /**
   * Returns the whole state of the game from the perspective of a single player
   */
  getPlayerState(playerId: string): ClientGame {
    const game = this.getState();

    return {
      id: game.id,
      players: game.players, // TODO: hide sensitive info
      spectators: game.spectators, // TODO: hide sensitive info
      host: game.host, // TODO: hide sensitive info
      state: {
        czar: game.state.czar,
        hand: game.state.hands[playerId] ?? [],
        round: game.state.round,
        phaseStartTime: game.state.phaseStartTime,
        phase: game.state.phase,
        table: game.state.table, // TODO: hide sensitive info
      },
    };
  }

  /**
   * Sets a new host player for the game.
   */
  setHost(player: ServerPlayer): ServerPlayer {
    this.settings.host = player;
    this.emitUpdate();
    return player;
  }

  /**
   * Updates the status of a player
   */
  setPlayerStatus(id: string, status: 'connected' | 'disconnected') {
    const player = this.players.find((p) => p.id === id);
    if (!player) return false;

    player.status = status;
    this.emitUpdate();
    return true;
  }

  /**
   * Adds a player to the game.
   */
  addPlayer(nickname: string): ServerPlayer | null {
    if (this.players.some((p) => p.nickname === nickname)) {
      throw new Error('nickname taken');
    }

    const player: ServerPlayer = {
      id: randomUUID(),
      token: randomUUID(),
      nickname,
      score: 0,
      status: 'disconnected',
    };

    this.players.push(player);
    this.emitUpdate();
    return player;
  }

  /**
   * Checks if a player in the game has the token.
   * Returns the player that has the token, or null if no player has that token.
   */
  authenticatePlayer(token: string): ServerPlayer | null {
    return this.players.find((p) => p.token === token) ?? null;
  }

  /**
   * Subscribes to game updates from the perspective of a single player.
   */
  subscribe(playerId: string, handler: CallbackFunc) {
    if (!this.listeners[playerId]) this.listeners[playerId] = [];
    this.listeners[playerId].push(handler);

    // call handler immediately with current value
    handler(this.getPlayerState(playerId));

    // return unsubscribe function to caller
    return () => {
      if (!this.listeners[playerId]) return;

      const index = this.listeners[playerId].indexOf(handler);
      if (index < 0) return;

      this.listeners[playerId].splice(index, 1);

      // remove entries with no listeners
      if (!this.listeners[playerId].length) {
        delete this.listeners[playerId];
      }
    };
  }

  /**
   * Updates the game state then emits an update event
   */
  async action<T>(event: string, payload: T, token: string): Promise<string | null> {
    const actions: Record<string, ActionHandler> = {
      submitAnswer: submitAnswerHandler,
      chooseWinner: chooseWinnerHandler,
      revealCard: revealCardHandler,
      default: () => {
        throw new Error('invalid action');
      },
    };

    try {
      // get handler function
      const handler = actions?.[event] ?? actions.default;
      const newState = await handler(this, payload, token);

      // override current state with updated state received from action handler
      this._overrideState(newState);
      this.emitUpdate();
      return null;
    } catch (err) {
      return (err as any).message;
    }
  }

  /**
   * Emits an event, calling all listeners with the current game state
   */
  private emitUpdate() {
    if (!Object.keys(this.listeners).length) return;

    for (const [playerId, listenerArr] of Object.entries(this.listeners)) {
      // get current game state for the player
      const state = this.getPlayerState(playerId);

      // call every listener for that player ID with the game state
      for (const listener of listenerArr) {
        listener(state);
      }
    }
  }

  /**
   * Returns the next `n` number of answer cards from the deck.
   * Does not remove the cards from the deck.
   */
  getAnswerCards(n: number = 1): AnswerCard[] {
    const cards = this.deck.answers;

    // get current index and increment it
    const index = this.deck.answerIndex++ % cards.length;

    // slice amount of cards from shuffled array, wrapping to the first cards when
    // index reaches length of cards
    return [...cards, ...cards].slice(index, index + n);
  }

  /**
   * Returns the next question card from the deck.
   * Does not remove the card from the deck.
   */
  getQuestionCard(): QuestionCard {
    const cards = this.deck.questions;

    // get current index and increment it
    const index = this.deck.questionIndex++ % cards.length;

    return cards[index];
  }
}
