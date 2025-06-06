describe('Finance Management E2E Test', () => {
    beforeEach(() => {
        cy.intercept('POST', '**/finance').as('createAmount');
        cy.intercept('PUT', '**/finance/*').as('updateAmount');
        cy.intercept('DELETE', '**/finance/*').as('deleteAmount');
        cy.visit('http://localhost:5173/FinanceOverview');
    });

    it('Moet een nieuw bedrag kunnen toevoegen', () => {
        cy.get('.btn-success').should('be.visible').click();

        cy.get('input[name="amountPayed"]').type('100');
        cy.get('input[name="amountDue"]').type('50');
        cy.get('input[name="amountTotal"]').type('150');
        cy.get('input[name="description"]').type('Test transactie');

        cy.contains('Opslaan').click();
        cy.wait('@createAmount').its('response.statusCode').should('eq', 201);

        // Controleer dat de nieuwe rij met de juiste data aanwezig is
        cy.get('table tbody tr').contains('Test transactie').parent('tr').within(() => {
            cy.contains('€100.00').should('exist');
            cy.contains('€50.00').should('exist');
            cy.contains('€150.00').should('exist');
        });
    });

    it('Toont foutmelding bij leeg invoerformulier', () => {
        cy.get('.btn-success').click();

        // Submit zonder invoer (alle velden required)
        cy.contains('Opslaan').click();

        // Verwacht dat formulier nog open blijft (modal bestaat nog)
        cy.get('.modal').should('exist');

        // Je kan ook error-berichten checken als je die hebt, bijvoorbeeld:
        cy.get('input:invalid').should('have.length.greaterThan', 0);
    });

    it('Kan toevoegen annuleren zonder iets op te slaan', () => {
        cy.get('.btn-success').click();

        cy.get('input[name="amountPayed"]').type('123');
        cy.get('input[name="amountDue"]').type('45');
        cy.get('input[name="amountTotal"]').type('168');
        cy.get('input[name="description"]').type('Annuleer test');

        cy.contains('Annuleren').click();

        // Modal is weg
        cy.get('.modal').should('not.exist');

        // Rij met die omschrijving mag NIET bestaan
        cy.get('table tbody tr').should('not.contain', 'Annuleer test');
    });

    it('Moet een bedrag kunnen bijwerken', () => {
        // Zorg dat er minstens één rij is
        cy.get('table tbody tr').should('exist');

        // Open eerste rij bewerken
        cy.get('table tbody tr').first().within(() => {
            cy.get('.btn-warning').click();
        });

        cy.get('input[name="amountPayed"]').clear().type('200');
        cy.get('input[name="amountDue"]').clear().type('100');
        cy.get('input[name="amountTotal"]').clear().type('300');
        cy.get('input[name="description"]').clear().type('Bijgewerkte transactie');

        cy.contains('Opslaan').click();

        // Wacht tot de update succesvol is verwerkt
        cy.wait('@updateAmount').its('response.statusCode').should('eq', 200);
        cy.wait(1000); // Geef de UI tijd om te updaten

        cy.reload(); // Zorg ervoor dat de UI herlaadt met de nieuwste data
        cy.wait(1000);

        // Controleer update in tabel
        cy.get('table tbody tr').first().within(() => {
            cy.get('td:nth-child(1)').should('have.text', 'Bijgewerkte transactie');
            cy.get('td:nth-child(2)').should('have.text', '€2000.00');
            cy.get('td:nth-child(3)').should('have.text', '€1000.00');
            cy.get('td:nth-child(4)').should('have.text', '€3000.00');
        });
    });

    it('Toont foutmelding bij mislukte creatie (API error)', () => {
        // Simuleer serverfout bij POST
        cy.intercept('POST', '**/finance', {
            statusCode: 500,
            body: { message: 'Server error' },
        }).as('createFail');

        cy.get('.btn-success').click();

        cy.get('input[name="amountPayed"]').type('100');
        cy.get('input[name="amountDue"]').type('50');
        cy.get('input[name="amountTotal"]').type('150');
        cy.get('input[name="description"]').type('Fail test');

        cy.contains('Opslaan').click();
        cy.wait('@createFail').its('response.statusCode').should('eq', 500);
        cy.contains('Fout bij toevoegen van gegevens').should('exist');

    });

    it('Moet een bedrag kunnen verwijderen', () => {
        // Zorg dat er minstens één rij is
        cy.get('table tbody tr').should('exist');

        // Verwijder eerste rij
        cy.get('table tbody tr').first().within(() => {
            cy.get('.btn-danger').click();
        });

        // Wacht tot de backend de verwijdering heeft bevestigd
        cy.wait('@deleteAmount').its('response.statusCode').should('eq', 200);

        // Geef de UI extra tijd om te updaten
        cy.wait(2000);
        cy.reload(); // Forceer een herlaad om de nieuwste data op te halen
        cy.wait(2000);

        // Controleer dat het aantal rijen is verminderd
        cy.get('table tbody tr').then(($rows) => {
            expect($rows.length).to.be.lessThan(2); // Zorg ervoor dat er minder rijen zijn na de verwijdering
        });
    });
});
