describe('Finance Management E2E Test', () => {
    beforeEach(() => {
        cy.intercept('POST', '**/finance').as('createAmount');
        cy.intercept('PUT', '**/finance/*').as('updateAmount');
        cy.intercept('DELETE', '**/finance/*').as('deleteAmount');
        cy.visit('http://localhost:5173/FinanceOverview');
    });

    it('Moet een nieuw bedrag kunnen toevoegen', () => {
        // Open formulier
        cy.get('.add-finance-btn').should('be.visible').click();

        // Vul gegevens in
        cy.get('input[name="amountPayed"]').type('100');
        cy.get('input[name="amountDue"]').type('50');
        cy.get('input[name="amountTotal"]').type('150');
        cy.get('input[name="description"]').type('Test transactie');

        // Opslaan
        cy.contains('Opslaan').click();
        cy.wait('@createAmount'); // Wacht op API-call
        cy.get('table tbody tr').should('exist'); // Controleer of het nieuwe bedrag zichtbaar is
    });

    it('Moet een bedrag kunnen bijwerken', () => {
        // Zorg ervoor dat er een bedrag bestaat
        cy.get('table tbody tr').should('exist');

        // Open bewerkingsformulier
        cy.get('table tbody tr').first().within(() => {
            cy.get('.edit-btn').should('be.visible').click();
        });

        // Wijzig gegevens
        cy.get('input[name="amountPayed"]').clear().type('200');
        cy.get('input[name="amountDue"]').clear().type('100');
        cy.get('input[name="amountTotal"]').clear().type('300');
        cy.get('input[name="description"]').clear().type('Bijgewerkte transactie');

        // Opslaan
        cy.contains('Opslaan').click();
        cy.wait('@updateAmount'); // Wacht op API-call
        cy.get('table tbody tr').should('exist'); // Controleer of het bedrag correct is bijgewerkt

        // Assert
        cy.get('table tbody tr').first().within(() => {
            cy.contains('200').should('exist');
            cy.contains('100').should('exist');
            cy.contains('Bijgewerkte transactie').should('exist');
        });
    });

    it('Moet een bedrag kunnen verwijderen', () => {
        // Zorg ervoor dat er een gast bestaat
        cy.get('table tbody tr').should('exist');

        // Arrange
        cy.get('table tbody tr').first().within(() => {
            cy.get('.delete-btn').should('be.visible').click();
        });

        // Act
        cy.wait(500);
    });
});
