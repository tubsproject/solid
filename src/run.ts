import { Client } from 'pg';
import express from "express";
import cookieSession from "cookie-session";
import { SolidClient } from "./index";

const EXPRESS_PORT = +(process.env.EXPRESS_PORT || 8000);
const EXPRESS_FULL_URL = process.env.EXPRESS_FULL_URL || `http://localhost:${EXPRESS_PORT}`;

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
  solidClient.addRoutesInExpress(expressApp, EXPRESS_FULL_URL);
  await new Promise(resolve => expressApp.listen(EXPRESS_PORT, () => resolve(undefined)));
  console.log(`Express app running on ${EXPRESS_PORT}. Please visit ${EXPRESS_FULL_URL}/`);
})();
