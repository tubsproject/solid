import { Client } from 'pg';
import express from "express";
import cookieSession from "cookie-session";
import { Solid } from "./index";

const EXPRESS_PORT = +(process.env.EXPRESS_PORT || 8000);
const EXPRESS_HOST = process.env.EXPRESS_HOST || `http://localhost:${EXPRESS_PORT}`;
const EXPRESS_PATH = '';

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
  
  const solidClient = new Solid(postgresClient);
  const routes = solidClient.getExpressRoutes(EXPRESS_HOST, EXPRESS_PATH);
  console.log(Object.keys(routes));
  Object.keys(routes).forEach(route => {
    expressApp.get(route, routes[route]);
  });
  await new Promise(resolve => expressApp.listen(EXPRESS_PORT, () => resolve(undefined)));
  console.log(`Express app running on ${EXPRESS_PORT}. Please visit ${EXPRESS_HOST}${EXPRESS_PATH}`);
})();
