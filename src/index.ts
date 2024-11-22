import { Client } from 'pg';
import { runExpress } from "./express";
import { storage } from "./postgres";

export class SolidClient {
  constructor(client: Client) {
    storage.setClient(client);
  }
  async listen(port: number, fullExpressUrl: string) {
    const expressApp = await runExpress(fullExpressUrl);
    await expressApp.listen(port);
  }
}
