import mockIssues1 from "../fixtures/issues-page-1.json";
import mockIssues2 from "../fixtures/issues-page-2.json";
import mockIssues3 from "../fixtures/issues-page-3.json";

interface MockProjectData {
  id: string;
  attributes: {
    projectId: string;
    name: string;
    message: string;
    stack: string;
    level: string;
    status: string;
    numEvents: number;
    numUsers: number;
  };
}

function deserializeMockRequest(mocks: MockProjectData[]) {
  return mocks.map((mock: MockProjectData) => {
    return {
      id: mock.id,
      ...mock.attributes,
    };
  });
}

describe("Issue List", () => {
  beforeEach(() => {
    const endpoint = "https://hidden-bastion-18291-71157d9a31ff.herokuapp.com";

    /*
      TODO use this const after adding NEXT_PUBLIC_API_BASE_URL to the Github env variables
      and update .github/workflows/main.yml with NEXT_PUBLIC_API_BASE_URL: ${{vars.NEXT_PUBLIC_API_BASE_URL}}

      const endpoint = Cypress.env("NEXT_PUBLIC_API_BASE_URL");
    */

    // setup request mocks
    cy.intercept("GET", `${endpoint}/projects`, {
      fixture: "projects.json",
    }).as("getProjects");

    cy.intercept("GET", `${endpoint}/issues?page=1`, {
      fixture: "issues-page-1.json",
    }).as("getIssuesPage1");

    cy.intercept("GET", `${endpoint}/issues?page=2`, {
      fixture: "issues-page-2.json",
    }).as("getIssuesPage2");

    cy.intercept("GET", `${endpoint}/issues?page=3`, {
      fixture: "issues-page-3.json",
    }).as("getIssuesPage3");

    // open issues page
    cy.visit(`http://localhost:3000/dashboard/issues`);

    // wait for request to resolve
    cy.wait(["@getProjects", "@getIssuesPage1"]);
    cy.wait(2000);

    // set button aliases
    cy.get("button").contains("Previous").as("prev-button");
    cy.get("button").contains("Next").as("next-button");
  });

  context(`desktop resolution`, () => {
    beforeEach(() => {
      cy.viewport(1025, 900);
    });

    it("renders the issues", () => {
      const issues = deserializeMockRequest(mockIssues1.data);

      cy.get("main")
        .find("tbody")
        .find("tr")
        .each(($el, index) => {
          const issue = issues[index];
          const firstLineOfStackTrace = issue.stack.split("\n")[1].trim();
          cy.wrap($el).contains(issue.name);
          cy.wrap($el).contains(issue.message);
          cy.wrap($el).contains(issue.numEvents);
          cy.wrap($el).contains(firstLineOfStackTrace);
        });
    });

    it("paginates the data", () => {
      // test first page
      cy.contains("Page 1 of 3");
      cy.get("@prev-button").should("have.attr", "disabled");

      // test navigation to second page
      cy.get("@next-button").click();
      cy.get("@prev-button").should("not.have.attr", "disabled");
      cy.contains("Page 2 of 3");
      cy.get("tbody tr:first").contains(
        deserializeMockRequest(mockIssues2.data)[0].message,
      );

      // test navigation to third and last page
      cy.get("@next-button").click();
      cy.get("@next-button").should("have.attr", "disabled");
      cy.contains("Page 3 of 3");
      cy.get("tbody tr:first").contains(
        deserializeMockRequest(mockIssues3.data)[0].message,
      );

      // test navigation back to second page
      cy.get("@prev-button").click();
      cy.get("@next-button").should("not.have.attr", "disabled");
      cy.contains("Page 2 of 3");
      cy.get("tbody tr:first").contains(
        deserializeMockRequest(mockIssues2.data)[0].message,
      );
    });

    it("persists page after reload", () => {
      cy.get("@next-button").click();
      cy.contains("Page 2 of 3");

      cy.reload();
      cy.wait(["@getProjects", "@getIssuesPage2"]);
      cy.wait(1500);
      cy.contains("Page 2 of 3");
    });
  });
});
