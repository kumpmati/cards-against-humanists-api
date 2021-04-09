import { ServiceAccount } from "firebase-admin";

export interface Config {
  dev: boolean;
  port: number;
  db: string;
  firebase: ServiceAccount;
}
