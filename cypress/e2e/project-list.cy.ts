import capitalize from "lodash/capitalize";
import mockProjects from "../fixtures/projects.json";

interface MockProjectData {
  id: string;
  attributes: {
    numIssues: number;
    numEvents24h: number;
    status: string;
    name: string;
    language: string;
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

describe("Project List", () => {
  beforeEach(() => {
    const endpoint = "https://hidden-bastion-18291-71157d9a31ff.herokuapp.com";

    /*
      TODO use this const after adding NEXT_PUBLIC_API_BASE_URL to the Github env variables
      and update .github/workflows/main.yml with NEXT_PUBLIC_API_BASE_URL: ${{vars.NEXT_PUBLIC_API_BASE_URL}}

      const endpoint = Cypress.env("NEXT_PUBLIC_API_BASE_URL");
    */

    // setup request mock
    cy.intercept("GET", `${endpoint}/projects`, {
      fixture: "projects.json",
    }).as("getProjects");

    // open projects page
    cy.visit("http://localhost:3000/dashboard");

    // wait for request to resolve
    cy.wait("@getProjects");
  });

  context("desktop resolution", () => {
    beforeEach(() => {
      cy.viewport(1025, 900);
    });

    it("renders the projects", () => {
      const languageNames = ["React", "Node.js", "Python"];

      const projects = deserializeMockRequest(mockProjects.data);

      // get all project cards
      cy.get("main")
        .find("li")
        .each(($el, index) => {
          // check that project data is rendered
          cy.wrap($el).contains(projects[index].name);
          cy.wrap($el).contains(languageNames[index]);
          cy.wrap($el).contains(projects[index].numIssues);
          cy.wrap($el).contains(projects[index].numEvents24h);
          cy.wrap($el).contains(capitalize(projects[index].status));
          cy.wrap($el)
            .find("a")
            .should("have.attr", "href", "/dashboard/issues");
        });
    });
  });
});
