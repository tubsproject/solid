import { EventEmitter } from "node:events";
import { Client } from "pg";


export class DataHome extends EventEmitter {
  getExpressRoutes(host: string, path: string) {
    return {};
  }
}
