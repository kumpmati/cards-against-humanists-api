import { GameSettings } from '@/types/game';
import { GameController } from '../game';

class Database {
  private connected: boolean;
  private games: Record<string, GameController>;

  constructor() {
    this.games = {};
    this.connected = false;
  }

  async init() {
    this.connected = true;
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
    this.games[id] = game;

    return game;
  }

  async getGame(id: string): Promise<GameController> {
    return this.games[id];
  }

  async gameExists(id: string): Promise<boolean> {
    return !!this.games[id];
  }
}

export const database = new Database();
