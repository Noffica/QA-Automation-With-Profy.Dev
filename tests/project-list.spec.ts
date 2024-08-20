import { test } from "@playwright/test";
import { data } from "./fixtures/projects.json";
import fs from "fs";
import path from "path";

test.describe("Projects list", () => {
  test.beforeEach(async ({ page }) => {
    const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

    /*
      TODO use this const after adding NEXT_PUBLIC_API_BASE_URL to the Github env variables
      and update .github/workflows/main.yml with NEXT_PUBLIC_API_BASE_URL: ${{vars.NEXT_PUBLIC_API_BASE_URL}}

      const endpoint = Cypress.env("NEXT_PUBLIC_API_BASE_URL");
    */

    await page.goto("http://localhost:3000/dashboard");

    await page.route(`${endpoint}/projects`, async (route) => {
      const fixturePath = path.resolve(__dirname, ".fixtures/projects.json");
      const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
      await route.fulfill({ body: JSON.stringify(fixture) });
    });
  });
});
