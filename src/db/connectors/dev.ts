import { Config } from "../../config/config";
import { Card, CardPack } from "../../game/types";
import { DBConnector, DBConnectorRequest } from "../types";
import { DiskConnector } from "./disk";

/**
 * Hybrid connector. Loads all cards initially from disk,
 * then the rest of the updates come from the secondary connector
 */
export class DevConnector implements DBConnector {
  private disk: DiskConnector;
  private secondary: DBConnector;

  /**
   * Takes in a secondary DB connector to use
   * as the source of change events.
   * @param secondary
   */
  constructor(secondary: DBConnector) {
    this.disk = new DiskConnector();
    this.secondary = secondary;
  }

  async init(config: Config) {
    console.log("[Hybrid] - Initializing...");

    await this.disk.init(config);
    await this.secondary.init(config);

    console.log("[Hybrid] - Initialized");
  }

  /**
   * TODO: get
   * Returns all cards of given type in a card pack
   * @param opts
   * @returns
   */
  async get<T extends Card>(opts: DBConnectorRequest): Promise<T[]> {
    return this.secondary.get(opts);
  }

  /**
   * Returns all the card packs on disk
   * @returns
   */
  async getAll(): Promise<CardPack[]> {
    console.log(" -- Loading from disk...");
    return this.disk.getAll();
  }

  /**
   * TODO: add
   * Writes a card to the disk
   * @param card
   * @returns
   */
  async add(card: Omit<Card, "id">): Promise<string> {
    return this.disk.add(card);
  }

  /**
   * TODO: attachListeners
   */
  async attachListeners(...args: any[]) {}

  /**
   * TODO: detachListeners
   */
  async detachListeners() {}

  /**
   * TODO: disconnect
   */
  async disconnect() {}
}
