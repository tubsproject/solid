import { Client } from 'pg';

import { getExpressRoutes } from "./express";
import { Storage } from "./postgres";

export class SolidClient {
  storage: Storage;
  constructor(client: Client) {
    this.storage = new Storage();
    this.storage.setClient(client);
  }
  addRoutesInExpress(expressApp: any, fullExpressUrl: string) {
    const routes = getExpressRoutes(this.storage, fullExpressUrl);
    Object.keys(routes).forEach(route => {
      expressApp.get(route, routes[route]);
    });
  }
}
