// modules
import { Locator, test } from "@playwright/test";

// files
import mockIssuesPageOne from "./fixtures/issues-page-1.json";

test.describe("Issue list", () => {
  test.beforeEach(({ page }) => {
    const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;

    // setup request mocks
    const getIssuesPageOne = page.route(
      `${endpoint}/issues?page=1`,
      async (route) => {
        await route.fulfill({
          body: JSON.stringify(mockIssuesPageOne),
        });
      },
    );

    test.describe("under 'Desktop' resolution", () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1025, height: 900 });
        await getIssuesPageOne;
      });

      test("renders the issues", async ({ page }) => {
        const rowsOfIssues: Locator = page
          .getByTestId("table-body")
          .getByTestId(/issue-/);
        await rowsOfIssues.click();
      });
    });
  });
});

// modules
// import { expect, Locator, test } from "@playwright/test";
// import { capitalize } from "lodash";
//
// // files
// import projectsMockedRespBody from "./fixtures/projects.json";
//
// test.describe("Projects list", () => {
//   const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
//
//   test.beforeEach(async ({ page }) => {
//     // load the base URL
//     await page.goto("http://localhost:3000/dashboard");
//
//     // set the API mock
//     await page.route(`${endpoint}/projects`, async (route) => {
//       await route.fulfill({
//         body: JSON.stringify(projectsMockedRespBody),
//       });
//     });
//   });
//
//   test.describe("'Desktop' resolution", () => {
//     test.beforeEach(async ({ page }) => {
//       await page.setViewportSize({ width: 1025, height: 900 });
//     });
//
//     test("renders the projects", async ({ page }) => {
//       // get project cards
//       const projectCards: Locator = page
//         .locator("main ul")
//         .getByRole("listitem");
//       await expect(projectCards).toHaveCount(3);
//
//       for (const projectDataMock of projectsMockedRespBody.data) {
//         const cardTestSubject: Locator = page.getByTestId(projectDataMock.id);
//         const { name, language, status } = projectDataMock.attributes;
//
//         await expect(cardTestSubject).toContainText(name);
//         await expect(cardTestSubject).toContainText(capitalize(language));
//         // await expect(cardTestSubject).toContainText(mockedRespAttr.numIssues); //BUG. Front-end fails to render data
//         // await expect(cardTestSubject).toContainText(mockedRespAttr.numEvents24h); //BUG. Front-end fails to render data
//         await expect(cardTestSubject).toContainText(capitalize(status));
//
//         await expect(cardTestSubject.getByRole("link")).toHaveAttribute(
//           "href",
//           "/dashboard/issues",
//         );
//       }
//     });
//   });
// });
