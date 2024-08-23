// modules
import { test } from "@playwright/test";

// files
import mockIssues1 from "./fixtures/issues-page-1.json";

test.describe("Issue list", () => {
  test.beforeEach(({ page }) => {
    const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

    // setup request mocks
    const getProjects = page.route(`${endpoint}/projects`, async (route) => {
      await route.fulfill({
        body: JSON.stringify(mockIssues1),
      });
    });
  });
});
