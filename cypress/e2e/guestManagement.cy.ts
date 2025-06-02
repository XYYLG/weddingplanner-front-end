describe('Guest Management E2E Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/Guest');
    });

    it('Moet een nieuwe gast kunnen toevoegen', () => {
        // Arrange
        cy.get('.add-guest-btn').should('be.visible').click();
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
            cy.get('.delete-btn').should('be.visible').click();
        });

        // Act
        cy.wait(500);
    });
});

it('Moet een gast kunnen bewerken', () => {
    // Zorg ervoor dat er een gast bestaat
    cy.get('table tbody tr').should('exist');
    // Arrange
    cy.get('table tbody tr').first().within(() => {
        cy.get('.edit-btn').should('be.visible').click();
    });

    // Wijzig gegevens
    cy.get('input[name="firstName"]').clear().type('Bewerkte Test');
    cy.get('input[name="lastName"]').clear().type('Gebruiker');
    cy.get('input[name="phoneNumber"]').clear().type('0698765432');
    cy.get('input[name="address"]').clear().type('Nieuwe Straat 456, Stad');

    // Act
    cy.contains('Opslaan').click();
    cy.wait('@updateGuest'); // Wacht op API-call
    cy.get('table tbody tr').should('exist'); // Controleer of de gast correct is bijgewerkt


    // Assert
    cy.get('table tbody tr').first().within(() => {
        cy.contains('Bewerkte Test').should('exist');
        cy.contains('0698765432').should('exist');
        cy.contains('Nieuwe Straat 456, Stad').should('exist');
        cy.contains('Gebruiker').should('exist');
    });
});
