// modules
import { expect, test } from "@playwright/test";
import { capitalize } from "lodash";

// files
import projectsMockedResponseBody from "./fixtures/projects.json";

test.describe("Projects list", () => {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
  // const mockWithProjectsJSON = page.route(
  //   `${endpoint}/projects`,
  //   async (route) => {
  //     await route.fulfill({
  //       contentType: "application/json",
  //       body: JSON.stringify(await import("./fixtures/projects.json")),
  //     });
  //   },
  // );

  test.beforeEach(async ({ page }) => {
    /*
      TODO use this const after adding NEXT_PUBLIC_API_BASE_URL to the Github env variables
      and update .github/workflows/main.yml with NEXT_PUBLIC_API_BASE_URL: ${{vars.NEXT_PUBLIC_API_BASE_URL}}

      const endpoint = Cypress.env("NEXT_PUBLIC_API_BASE_URL");
    */

    // load the base URL
    await page.goto("http://localhost:3000/dashboard");

    // set the API mock
    await page.route(`${endpoint}/projects`, async (route) => {
      await route.fulfill({
        body: JSON.stringify(projectsMockedResponseBody),
      });
    });
  });

  test.describe("'Desktop' resolution", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1025, height: 900 });
    });

    test("renders the projects", async ({ page }) => {
      const languageNames = ["React", "Node.js", "Python"];

      // get project cards
      const projectCards = await page.locator("main li").all();
      for (let i = 0; i < projectCards.length; i++) {
        const card = projectCards[i];
        const mockedResponse = projectsMockedResponseBody.data[i].attributes;

        await expect(card).toContainText(mockedResponse.name);
        await expect(card).toContainText(languageNames[i]);
        await expect(card).toContainText(mockedResponse.numIssues);
        await expect(card).toContainText(mockedResponse.numEvents24h);
        await expect(card).toContainText(capitalize(mockedResponse.status));

        await expect(card.getByRole("link")).toHaveAttribute(
          "href",
          "/dashboard/issues",
        );
      }
    });
  });
});
