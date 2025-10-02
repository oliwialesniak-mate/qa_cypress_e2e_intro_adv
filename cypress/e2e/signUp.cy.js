// cypress/e2e/signUp.cy.js
import { generateUser } from '../support/generate';

Cypress.on('uncaught:exception', () => false);

describe('Sign Up page', () => {
  it('should provide an ability to register new account', () => {
    const user = generateUser();

    cy.visit('https://react-redux.realworld.io');
    cy.contains('a', 'Sign up').click();

    cy.get('input[placeholder="Username"]').type(user.username);
    cy.get('input[placeholder="Email"]').type(user.email);
    cy.get('input[placeholder="Password"]').type(user.password);

    cy.intercept('POST', '**/api/users').as('createUser');
    cy.contains('button', 'Sign up').click();

    // Wait for signup request
    cy.wait('@createUser')
      .its('response.statusCode')
      .should('be.oneOf', [200, 307]);

    // Assert username is visible in nav
    cy.get('nav', { timeout: 15000 })
      .contains(user.username)
      .should('be.visible');
  });
});
