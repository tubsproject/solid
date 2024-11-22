import { Client } from 'pg';
import { SolidClient } from "./index";

const EXPRESS_PORT = +(process.env.EXPRESS_PORT || 8000);

const EXPRESS_FULL_URL = process.env.EXPRESS_FULL_URL || `http://localhost:${EXPRESS_PORT}`;

(async () => {
  const client = new Client({
    user: 'tubs',
    password: process.env.PGPASS,
    database: 'tubs',
    host: '127.0.0.1'
  });
  await client.connect();
  const app = new SolidClient(client);
  await app.listen(EXPRESS_PORT, EXPRESS_FULL_URL);
  console.log(`Express app running on ${EXPRESS_PORT}. Please visit ${EXPRESS_FULL_URL}/`);
})();
