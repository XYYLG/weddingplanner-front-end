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

        // Assert
        //  cy.request('GET').its('body').should('deep.include', {
        //    firstName: 'Test',
        //  lastName: 'Gebruiker',
        // phoneNumber: '0612345678',
        // address: 'Straat 123, Stad'
    });
});

it('Moet een gast kunnen verwijderen', () => {
    // Arrange
    cy.get('table tbody tr').first().within(() => {
        cy.get('.delete-btn').click();
    });

    // Act
    cy.wait(500);
});