import { IStorage } from "@inrupt/solid-client-authn-node";
class Storage implements IStorage {
  private data: {
    [key: string]: string
  } = {};

  async delete(key: string): Promise<void> {
    delete this.data[key];
  }
  async get(key: string): Promise<undefined | string> {
    return this.data[key];
  }
  async set(key: string, value: string): Promise<void> {
    console.log('storing', key, value);
    
    this.data[key] = value;
  }
}
export const storage = new Storage();