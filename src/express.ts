import { NextFunction, Request, Response } from "express";
import { Storage } from "./postgres";

import {
  getSessionFromStorage,
  Session
} from "@inrupt/solid-client-authn-node";

export function getExpressRoutes(storage: Storage, EXPRESS_FULL_URL: string): { [route: string]: (req: Request, res: Response, next: NextFunction) => Promise<void>} {
  return {
    "/solid": async (req: Request, res: Response) => {
      const session = await getSessionFromStorage(req.session?.sessionId, storage);
      if (session?.info.webId && session?.info.isLoggedIn) {
        res.status(200).send(`Hello ${session?.info.webId}<br><input type="submit" value="log out of Solid" onclick="location='/solid/logout';"><br><a href="/">to main page</a>`);
      } else {
        res.status(200).send([
          `<input type="submit" value="pivot.pondersource.com" onclick="location='/solid/login?server=pivot.pondersource.com';"><br>`,
          `<input type="submit" value="solidcommunity.net" onclick="location='/solid/login?server=solidcommunity.net';"><br>`,
          `<input type="submit" value="inrupt.net" onclick="location='/solid/login?server=inrupt.net';"><br>`,
          `<input type="text" placeholder="bring your own" id="fill">`,
          `<input type="submit" value="go" onclick="location='/solid/login?server=' + document.getElementById('fill').value;"><br>`,
          `<br><a href="/">to main page</a>`
        ].join('\n'));
      }
    },
    
    // Login end point to authenticate with a Solid identity provider
    "/solid/login": async (req: Request, res: Response) => {
      const session = new Session({ storage });
      const loginURL = req.query.loginURL as string;
      
      if (req.session) {
        req.session.sessionId = session.info.sessionId;
      }
      
      await session.login({
        oidcIssuer: `https://${req.query.server}`,
        redirectUrl: `${EXPRESS_FULL_URL}/solid/login/callback`,
        clientName: "The Ultimate Bookkeeping System",
        handleRedirect: (url: any) => res.redirect(url),
      });
    },
    
    // Login callback receives the session and stores it in memory
    "/solid/login/callback": async (req: Request, res: Response) => {
      const session = await getSessionFromStorage(req.session?.sessionId, storage);
      // console.log(session);
      // console.log(`handling incoming redirect`, `${EXPRESS_FULL_URL}${req.url}`);
      
      await session?.handleIncomingRedirect(`${EXPRESS_FULL_URL}${req.url}`);
      
      if (session?.info.webId && session?.info.isLoggedIn) {
        // return res.redirect('logged in');
        await res.redirect('/solid');
      }
    },
    
    // Endpoint to forget a session.
    "/solid/logout": async (req: Request, res: Response, next: NextFunction) => {
      const session = await getSessionFromStorage(req.session?.sessionId, storage);
      session?.logout();
      await res.redirect('/solid');
    },
  };
}
