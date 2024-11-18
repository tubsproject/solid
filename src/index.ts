import { EXPRESS_FULL_URL, EXPRESS_PORT } from "./config/default";
import { expressApp } from "./express";
import { sessionStore } from "./sharedSessions";
import { IMessage } from "./types";
import { createUserMessage, isUrlValid } from "./utils";
import { logger } from "./utils/logger";

(async () => {
  await expressApp.listen(EXPRESS_PORT, () => logger.info(`Express app running on port http://localhost:${EXPRESS_PORT}`));
})();
