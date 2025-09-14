/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to login with test credentials
       * @example cy.login('test1', 'pass')
       */
      login(username: string, password: string): Chainable<void>;

      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('login', (username: string, password: string) => {
  // Visit the signin page
  cy.visit('/api/auth/signin');

  // Fill in the credentials
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);

  // Submit the form
  cy.get('button[type="submit"]').click();

  // Wait for redirect to home page
  cy.url().should('eq', 'http://localhost:3000/');
});

Cypress.Commands.add('logout', () => {
  // Click the sign out button
  cy.get('button').contains('Sign out').click();

  // Wait for redirect to signin page
  cy.url().should('include', '/api/auth/signin');
});
