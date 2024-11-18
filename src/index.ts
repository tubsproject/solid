import { EXPRESS_PORT, EXPRESS_FULL_URL, expressApp } from "./express";

(async () => {
  await expressApp.listen(EXPRESS_PORT, () => console.log(`Express app running on ${EXPRESS_PORT}. Please visit ${EXPRESS_FULL_URL}/login`));
})();
