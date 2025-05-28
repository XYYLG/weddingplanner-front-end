describe('Guest Management E2E Test', () => {
    const apiUrl = 'http://localhost:8081/guest';

    beforeEach(() => {
        cy.visit('http://localhost:5173/');
    });

    it('Moet alle gasten laden', () => {
        cy.request(apiUrl).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('Moet een nieuwe gast kunnen toevoegen', () => { cy.get('.add-guest-btn').should('be.visible').click(); cy.get('input[name="firstName"]').type('Test'); cy.get('input[name="lastName"]').type('Gebruiker'); cy.get('input[name="phoneNumber"]').type('0612345678'); cy.get('input[name="address"]').type('Straat 123, Stad'); cy.contains('Opslaan').click(); cy.request(apiUrl).its('body').should('deep.include', { firstName: 'Test', lastName: 'Gebruiker', phoneNumber: '0612345678', address: 'Straat 123, Stad' }); });


    it('Moet een gast kunnen verwijderen', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('.delete-btn').click();
        });

        cy.wait(500);
        cy.request(apiUrl).its('body').should('not.deep.include', {
            firstName: 'Test',
            lastName: 'Gebruiker',
        });
    });
});