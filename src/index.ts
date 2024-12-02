import { Client } from 'pg';
import { NextFunction, Request, Response } from "express";
import {
  getSessionFromStorage,
  Session
} from "@inrupt/solid-client-authn-node";

import { DataHome } from "./DataHome";
import { Storage } from "./postgres";

export { DataHome } from "./DataHome";

export class Solid extends DataHome {
  storage: Storage;
  constructor(client: Client) {
    super();
    this.storage = new Storage();
    this.storage.setClient(client);
  }
  async getWebId(req: Request): Promise<string | undefined> {
    const session = await getSessionFromStorage(req.session?.sessionId, this.storage);
    if (session?.info.webId && session?.info.isLoggedIn) {
      return session?.info.webId;
    }
    return undefined;
  }

  getExpressRoutes(host: string, path: string): { [route: string]: (req: Request, res: Response, next: NextFunction) => Promise<void>} {
    return {
      [`${path}/`]: async (req: Request, res: Response) => {
        const webId = this.getWebId(req);
        if (webId) {
          this.emit('login', 'solid', webId);
          res.status(200).send(`Hello ${webId}<br><input type="submit" value="log out of Solid" onclick="location='${path}/logout';"><br><a href="/">to main page</a>`);
        } else {
          res.status(200).send([
            `<input type="submit" value="pivot.pondersource.com" onclick="location='${path}/login?server=pivot.pondersource.com';"><br>`,
            `<input type="submit" value="solidcommunity.net" onclick="location='${path}/login?server=solidcommunity.net';"><br>`,
            `<input type="submit" value="inrupt.net" onclick="location='${path}/login?server=inrupt.net';"><br>`,
            `<input type="text" placeholder="bring your own" id="fill">`,
            `<input type="submit" value="go" onclick="location='${path}/login?server=' + document.getElementById('fill').value;"><br>`,
            `<br><a href="/">to main page</a>`
          ].join('\n'));
        }
      },
      
      // Login end point to authenticate with a Solid identity provider
      [`${path}/login`]: async (req: Request, res: Response) => {
        console.log('getting session');
        const session = new Session({ storage: this.storage });
        const loginURL = req.query.loginURL as string;
        
        if (req.session) {
          req.session.sessionId = session.info.sessionId;
        }
        console.log(`calling Solid session login with redirectUrl ${host}${path}/login/callback`);
        await session.login({
          oidcIssuer: `https://${req.query.server}`,
          redirectUrl: `${host}${path}/login/callback`,
          clientName: "The Ultimate Bookkeeping System",
          handleRedirect: (url: any) => res.redirect(url),
        });
      },
      
      // Login callback receives the session and stores it in memory
      [`${path}/login/callback`]: async (req: Request, res: Response) => {
        const session = await getSessionFromStorage(req.session?.sessionId, this.storage);
        // console.log(session);
        // console.log(`handling incoming redirect`, `${EXPRESS_FULL_URL}${req.url}`);
        
        await session?.handleIncomingRedirect(`${host}${req.url}`);
        
        if (session?.info.webId && session?.info.isLoggedIn) {
          // return res.redirect('logged in');
          await res.redirect(`${path}/`);
        }
      },
      
      // Endpoint to forget a session.
      [`${path}/logout`]: async (req: Request, res: Response, next: NextFunction) => {
        const session = await getSessionFromStorage(req.session?.sessionId, this.storage);
        session?.logout();
        this.emit('logout', 'solid', session?.info.webId);
        await res.redirect(`${path}/`);
      },
    };
  }
}
