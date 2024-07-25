/*
  I'm not 100% sure why this is working, but here's the
  Stack Overflow link: https://stackoverflow.com/a/62288163
*/
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  retries: {
    runMode: 2,
    openMode: 1,
  },

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
