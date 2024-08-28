// modules
import { expect, Locator, test } from "@playwright/test";

// files
import { capitalize } from "lodash";
import mockIssuesPageOne from "./fixtures/issues-page-1.json";

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
      // all 10 `issue` entities load on the page
      await expect(
        page.getByTestId("issues-table-body").getByRole("row"),
      ).toHaveCount(10);

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
  });
});
