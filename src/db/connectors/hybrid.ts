import { Config } from "../../config/config";
import { Card, CardPack } from "../../game/types";
import { DBConnector, DBConnectorRequest } from "../types";
import { DiskConnector } from "./disk";
import { FirebaseConnector } from "./firebase";

/**
 * Hybrid connector. Loads all cards initially from disk,
 * then any updates from Firestore will be updated to the disk
 */
export class DevConnector implements DBConnector {
  private firebase: FirebaseConnector;
  private disk: DiskConnector;

  async init(config: Config) {
    console.log("[Hybrid] - Initializing...");

    this.firebase = new FirebaseConnector();
    await this.firebase.init(config);

    this.disk = new DiskConnector();
    await this.disk.init(config);

    console.log("[Hybrid] - Initialized");
  }

  /**
   * TODO: get
   * Returns all cards of given type in a card pack
   * @param opts
   * @returns
   */
  async get<T extends Card>(opts: DBConnectorRequest): Promise<T[]> {
    return this.firebase.get(opts);
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
