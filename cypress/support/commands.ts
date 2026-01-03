/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredientToConstructor(ingredientName: string): Chainable<void>;
      openIngredientModal(ingredientName: string): Chainable<void>;
      closeModal(): Chainable<void>;
      switchToTab(tabName: string): Chainable<void>;
      addBurgerForOrder(
        bunName: string,
        fillingTabName: string,
        fillingName: string
      ): Chainable<void>;
    }
  }
}

// Команда для добавления ингредиента в конструктор
Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  cy.contains(ingredientName)
    .should('be.visible')
    .parent()
    .find('button')
    .contains('Добавить')
    .should('be.visible')
    .click();
});

// Команда для открытия модального окна ингредиента
Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.contains(ingredientName)
    .should('be.visible')
    .parent()
    .find('a')
    .first()
    .should('be.visible')
    .click();
});

// Команда для закрытия модального окна (клик на крестик)
Cypress.Commands.add('closeModal', () => {
  cy.get('#modals')
    .should('exist')
    .within(() => {
      cy.get('button[type="button"]').first().should('be.visible').click();
    });
});

// Команда для переключения на вкладку ингредиентов
Cypress.Commands.add('switchToTab', (tabName: string) => {
  cy.contains(tabName).should('be.visible').click();
});

// Команда для добавления булки и начинки для создания заказа
Cypress.Commands.add(
  'addBurgerForOrder',
  (bunName: string, fillingTabName: string, fillingName: string) => {
    cy.addIngredientToConstructor(bunName);
    cy.switchToTab(fillingTabName);
    cy.addIngredientToConstructor(fillingName);
  }
);

export {};
