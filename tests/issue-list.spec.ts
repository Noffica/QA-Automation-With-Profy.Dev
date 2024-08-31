// modules
import { expect, Locator, test } from "@playwright/test";

// files
import { capitalize } from "lodash";
import mockIssuesPageOne from "./fixtures/issues-page-1.json";

test.describe("Issue list", () => {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

  test.beforeEach(async ({ page }) => {
    // setup request mocks
    await page.route(`${endpoint}/issues?page=1`, async (route) => {
      await route.fulfill({
        body: JSON.stringify(mockIssuesPageOne),
      });
    });
    await page.goto("http://localhost:3000/dashboard/issues?page=1");
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

      // "context" and "page" fixtures are not supported in "beforeAll" since they are created on a per-test basis.
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

      test("confirms 'Previous' button disabled, 'Next' button enabled on first page", async () => {
        await expect(buttonPrevious).toBeDisabled();
        await expect(buttonNext).toBeEnabled();
      });

      test("confirms 'Previous' and 'Next' buttons enabled on non-end pages", async () => {
        // navigate to pg. 2 then run the assertions
        await buttonNext.click();
        await expect(buttonPrevious).toBeEnabled();
        await expect(buttonNext).toBeEnabled();
      });

      test.describe("population of 'issue' entities upon navigating back/forth between pages & reloading", () => {
        let issuePresentOnlyOnPageTwo: Locator;

        // "context" and "page" fixtures are not supported in "beforeAll" since they are created on a per-test basis.
        test.beforeEach(({ page }) => {
          issuePresentOnlyOnPageTwo = page
            .getByTestId("error-message")
            .filter({ hasText: "Unexpected '#' used outside of class body" });
        });

        test("confirms population of list of issues and issue data upon navigating to another page", async () => {
          // go to pg. 2
          await buttonNext.click();
          await expect(issuePresentOnlyOnPageTwo).toBeVisible();
        });
        test("confirms list of issues and issue data load after navigating to next page and back", async () => {
          // go to pg. 2
          await buttonNext.click();
          // go to pg. 3
          await buttonNext.click();
          // back to pg. 2
          await buttonPrevious.click();
          // assertion
          await expect(issuePresentOnlyOnPageTwo).toBeVisible();
        });
        test("confirms list of issues and issue data load after navigating to next page, reloading and back", async ({
          page,
        }) => {
          // go to pg. 2
          await buttonNext.click();
          // go to pg. 3
          await buttonNext.click();
          // reload on pg. 3
          await page.reload();
          // back to pg. 2
          await buttonPrevious.click();

          // run assertions
          await expect(issuePresentOnlyOnPageTwo).toBeVisible();
        });
      });

      // BUG. See https://trello.com/c/Ju5V7ya0
      test.skip(
        "confirms 'Previous' button enabled, 'Next' button disabled on last page",
        { tag: "@bug" },
        async () => {},
      );
    });
  });
});
