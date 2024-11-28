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
import express from "express";
import cookieSession from "cookie-session";
import { SolidClient } from "@tubsproject/solid-client";

(async () => {
  const postgresClient = new Client({
    user: 'tubs',
    password: process.env.PGPASS,
    database: 'tubs',
    host: '127.0.0.1'
  });
  await postgresClient.connect();

  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(
    cookieSession({
      name: "session",
      // These keys are required by cookie-session to sign the cookies.
      keys: [
        "Required, but value not relevant for this demo - key1",
        "Required, but value not relevant for this demo - key2",
      ],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  ); 
  
  const solidClient = new SolidClient(postgresClient);
  solidClient.addRoutesInExpress(expressApp, `http://localhost:8000`);
  await new Promise(resolve => expressApp.listen(8000, () => resolve(undefined)));
})();
```