# Solid Client

A simple Node.js script that can interact with a Solid Server.

To run `src/run.ts` as a stand-alone demo app:
```
npm install
npm run build
npm start
```

To use this module from your project:
```ts
import { Client } from 'pg';
import { SolidClient } from "@tubsproject/solid-client";

(async () => {
  const client = new Client({
    user: 'tubs',
    password: process.env.PGPASS,
    database: 'tubs',
    host: '127.0.0.1'
  });
  await client.connect();
  const app = new SolidClient(client);
  await app.listen(8000, `http://localhost:8000`);
})();
```

FIXME: [How can the UI of this app be integrated into the UI of another one?](https://github.com/tubsproject/solid-client/issues/1)
