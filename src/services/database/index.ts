import { AnswerCard, QuestionCard } from '@/types/cards';
import { GameSettings } from '@/types/game';
import { GameController } from '../game';
import cardData from '@/mock/cards.json';

class Database {
  private connected: boolean;
  private games: Record<string, GameController>;
  private cards: Record<string, { answers: AnswerCard[]; questions: QuestionCard[] }>;

  constructor() {
    this.games = {};
    this.cards = {};
    this.connected = false;
  }

  async init() {
    this.connected = true;

    // TODO: load from external database
    // load mock cards from disk
    this.cards.mock = cardData as any;
  }

  private _checkIsInitialized() {
    if (!this.connected) throw new Error('database not initialized');
  }

  async createGame(id: string, settings: GameSettings): Promise<GameController | null> {
    this._checkIsInitialized();

    if (this.games[id]) {
      console.error('game already exists');
      return null;
    }

    const game = new GameController(id, settings);
    // load cards to game
    game.setDeck(this.cards.mock);

    this.games[id] = game;

    return game;
  }

  async deleteGame(id: string): Promise<boolean> {
    this._checkIsInitialized();

    if (!(await this.gameExists(id))) {
      console.error('game does not exist');
      return false;
    }

    delete this.games[id];
    return true;
  }

  async getGame(id: string): Promise<GameController | null> {
    if (!(await this.gameExists(id))) return null;

    return this.games[id];
  }

  async gameExists(id: string): Promise<boolean> {
    return !!this.games[id];
  }
}

export const database = new Database();
