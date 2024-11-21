import { Client } from 'pg';
import { IStorage } from "@inrupt/solid-client-authn-node";
class Storage implements IStorage {
  private client: Client | undefined;

  setClient(client: Client) {
    this.client = client;
  }

  async delete(key: string): Promise<void> {
    await this.client?.query(`DELETE FROM "solid_session" WHERE "key" = $1`, [ key ]);
  }

  async get(key: string): Promise<undefined | string> {
    console.log('retrieving', key);
    const res = await this.client?.query(`SELECT "value" FROM "solid_session" WHERE "key" = $1`, [ key ]);
    console.log(res);
    if (Array.isArray(res?.rows)) {
      try {
        const ret = res.rows[res.rows.length - 1].value;
        console.log('returning', ret);
        return ret;
      } catch (e) {
        console.error(e);
      }
    }
    return undefined;
  }

  async set(key: string, value: string): Promise<void> {
    console.log('storing', key, value);
    await this.client?.query(`INSERT INTO "solid_session" ("key", "value") VALUES ($1, $2)`, [
      key,
      value
    ]);
  }
}
export const storage = new Storage();