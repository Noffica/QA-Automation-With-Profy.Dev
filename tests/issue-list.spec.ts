// modules
import { expect, Locator, test } from "@playwright/test";

// files
import { capitalize } from "lodash";
import mockIssuesPageOne from "./fixtures/issues-page-1.json";
import { count } from "rxjs";

test.describe("Issue list", () => {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/issues?page=1");
    // setup request mocks
    await page.route(`${endpoint}/issues?page=1`, async (route) => {
      await route.fulfill({
        body: JSON.stringify(mockIssuesPageOne),
      });
    });
  });

  test.describe("under 'Desktop' resolution", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1025, height: 900 });
    });

    test("renders the issues", async ({ page }) => {
      // every `issue` entity shows its `name`/type, `level` and `message`
      for (const {
        id,
        attributes: { name, level, message },
      } of mockIssuesPageOne.data) {
        const issueRow: Locator = page.getByTestId(`issue-${id}`);
        await expect(issueRow.getByTestId("error-name")).toContainText(name);
        await expect(issueRow.getByTestId("badge-level")).toContainText(
          capitalize(level),
        );
        await expect(issueRow.getByTestId("error-message")).toContainText(
          message,
        );
      }
    });

    test.describe("pagination", () => {
      let buttonPrevious: Locator;
      let buttonNext: Locator;

      test.beforeEach(({ page }) => {
        buttonPrevious = page.getByRole("button", { name: "Previous" });
        buttonNext = page.getByRole("button", { name: "Next" });
      });

      test("populates the first page with 10 'issue' entities", async ({
        page,
      }) => {
        // all 10 `issue` entities load on the page
        await expect(
          page.getByTestId("issues-table-body").getByRole("row"),
        ).toHaveCount(10);
      });

      test("sees 'Previous' button disabled, 'Next' button enabled on first page", async ({
        page,
      }) => {
        // TODO: file a ticket on Trello to fix pagination information
        //       currently displayed as "Page of "
        await expect(buttonPrevious).toBeDisabled();
        await expect(buttonNext).toBeEnabled();
      });

      test("sees 'Previous' and 'Next' buttons enabled on non-end pages", async () => {
        await buttonNext.click().then(async () => {
          await expect(buttonPrevious).toBeEnabled();
          await expect(buttonNext).toBeEnabled();
        });
      });

      test.describe("population of 'issue' entities upon navigating back and forth between pages, reloading", () => {
        let listOfIssues: Locator;
        let issuePresentOnlyOnPageTwo: Locator;

        test.beforeEach(({ page }) => {
          listOfIssues = page.getByTestId("issues-table-body").getByRole("row");

          issuePresentOnlyOnPageTwo = page
            .getByTestId("error-message")
            .filter({ hasText: "Unexpected '#' used outside of class body" });
        });
        test.afterEach(async () => {
          await expect(listOfIssues).toHaveCount(10);
          await expect(issuePresentOnlyOnPageTwo).toBeVisible();
        });

        test("confirms list of issues and issue data load upon navigating to another page", async () => {
          // go to pg. 2
          await buttonNext.click();
          // run assertions in `.afterEach()`
        });
        test("confirms list of issues and issue data load after navigating to next page and back", async () => {
          // go to pg. 2
          await buttonNext.click().then(async () => {
            // go to pg. 3
            await buttonNext.click().then(async () => {
              // back to pg. 2
              await buttonPrevious.click();
            });
          });
          // run assertions in `.afterEach()`
        });
        test("confirms list of issues and issue data load after navigating to next page, reloading and back", async ({
          page,
        }) => {
          // go to pg. 2
          await buttonNext.click().then(async () => {
            // go to pg. 3
            await buttonNext.click().then(async () => {
              // reload on pg. 3
              await page.reload().then(async () => {
                // back to pg. 2
                await buttonPrevious.click();
              });
            });
          });
          // run assertions in `.afterEach()`
        });
      });

      test("sees 'Previous' button enabled, 'Next' button disabled on last page", async () => {
        // go to pg. 2
        await buttonNext.click().then(async () => {
          // go to pg. 3
          await buttonNext.click().then(async () => {
            // go to pg. 4 - the last page
            await buttonNext.click().then(async () => {
              await expect.soft(buttonNext).toBeDisabled(); //TODO: create a work-order for this bug
              await expect(buttonPrevious).toBeEnabled();
            });
          });
        });
      });
    });
  });
});
