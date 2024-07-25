import { expect, test } from "@playwright/test";

test.describe("Sidebar navigation", () => {
  test.describe("under 'Desktop' resolution", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1025, height: 900 });
      await page.goto("http://localhost:3000/dashboard");
    });

    test("links work as expected", async ({ page }) => {
      await expect(
        page.getByRole("navigation").getByText("Projects"),
      ).toHaveAttribute("href", "/dashboard");

      await expect(
        page.getByRole("navigation").getByText("Issues"),
      ).toHaveAttribute("href", "/dashboard/issues");

      await expect(
        page.getByRole("navigation").getByText("Alerts"),
      ).toHaveAttribute("href", "/dashboard/alerts");

      await expect(
        page.getByRole("navigation").getByText("Users"),
      ).toHaveAttribute("href", "/dashboard/users");

      await expect(
        page.getByRole("navigation").getByText("Settings"),
      ).toHaveAttribute("href", "/dashboard/settings");
    });

    test("nav. bar is collapsible", async ({ page }) => {
      const navigationPanel = page.getByRole("navigation");

      // chec nav. panel is in view
      await expect(navigationPanel).toBeInViewport();
      await expect(navigationPanel.getByText("Issues")).toBeVisible();
      await expect(navigationPanel.getByRole("link")).toHaveCount(5);

      // now nav. will be collapsed
      await page.getByRole("button", { name: "Collapse" }).click();
      await expect(navigationPanel.getByText("Issues")).not.toBeVisible();
      await expect(navigationPanel.getByRole("link")).toHaveCount(5);
    });
  });

  test.describe("under 'Mobile' resolution", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
      // set resolution to that of iPhone 8 (in pixels)
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("http://localhost:3000/dashboard");
    });

    test("toggles navigation sidebar by clicking the menu icon", async ({
      page,
    }) => {
      // not in viewport at start / by default
      await expect(page.getByRole("navigation")).not.toBeInViewport();

      // click the triple lines icon to bring the navigation sidebar into view
      await page.getByAltText("open menu").click();
      await expect(page.getByRole("navigation")).toBeInViewport();
    });
  });
});
