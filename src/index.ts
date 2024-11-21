import { Client } from 'pg';
import { EXPRESS_PORT, EXPRESS_FULL_URL, expressApp } from "./express";
import { storage } from "./postgres";

(async () => {
  const client = new Client({
    user: 'tubs',
    password: process.env.PGPASS,
    database: 'tubs',
    host: '127.0.0.1'
  });
  await client.connect();
  storage.setClient(client);
  await expressApp.listen(EXPRESS_PORT, () => console.log(`Express app running on ${EXPRESS_PORT}. Please visit ${EXPRESS_FULL_URL}/login`));
})();
