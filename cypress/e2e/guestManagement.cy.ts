describe('Guest Management E2E Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/Guest');
    });

    it('Moet een nieuwe gast kunnen toevoegen', () => {
        // Arrange
        cy.get('.btn-success').should('be.visible').click(); // Nieuwe gast toevoegen button
        cy.get('input[name="firstName"]').type('Test');
        cy.get('input[name="lastName"]').type('Gebruiker');
        cy.get('input[name="phoneNumber"]').type('0612345678');
        cy.get('input[name="address"]').type('Straat 123, Stad');

        // Act
        cy.contains('Opslaan').click();
    });

    it('Moet een gast kunnen verwijderen', () => {
        // Zorg ervoor dat er een gast bestaat
        cy.get('table tbody tr').should('exist');

        // Arrange
        cy.get('table tbody tr').first().within(() => {
            cy.get('.btn-danger').should('be.visible').click(); // Correcte verwijder button
        });

        // Act
        cy.wait(500);
    });

    it('Moet een gast kunnen bewerken', () => {
        // Zorg ervoor dat er een gast bestaat
        cy.get('table tbody tr').should('exist');

        // Arrange
        cy.get('table tbody tr').first().within(() => {
            cy.get('.btn-warning').should('be.visible').click(); // Correcte bewerken button
        });

        // Wijzig gegevens
        cy.get('input[name="firstName"]').clear().type('Bewerkte Test');
        cy.get('input[name="lastName"]').clear().type('Gebruiker');
        cy.get('input[name="phoneNumber"]').clear().type('0698765432');
        cy.get('input[name="address"]').clear().type('Nieuwe Straat 456, Stad');

        // Act
        cy.contains('Opslaan').click();
        cy.wait('@updateGuest'); // Wacht op API-call

        // Assert
        cy.get('table tbody tr').first().within(() => {
            cy.contains('Bewerkte Test').should('exist');
            cy.contains('Gebruiker').should('exist');
            cy.contains('0698765432').should('exist');
            cy.contains('Nieuwe Straat 456, Stad').should('exist');
        });
    });
});
