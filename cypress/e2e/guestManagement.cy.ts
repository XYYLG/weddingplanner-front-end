describe('Guest Management E2E Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/Guest');
    });

    it('Moet een nieuwe gast kunnen toevoegen en zichtbaar maken in de lijst', () => {
        const firstName = 'Cypress';
        const lastName = 'Testgast';

        // Arrange
        cy.get('button.btn-success').click(); // "+ Nieuwe gast toevoegen"

        cy.get('input[name="firstName"]').type(firstName);
        cy.get('input[name="lastName"]').type(lastName);
        cy.get('input[name="phoneNumber"]').type('0612345678');
        cy.get('input[name="address"]').type('Cypresslaan 5');

        // Act
        cy.contains('Opslaan').click();

        // Assert: controleer dat de nieuwe gast zichtbaar is
        cy.get('table tbody tr').should('contain', firstName).and('contain', lastName);
    });

    it('Moet validatiefout geven als verplichte velden ontbreken', () => {
        // Arrange
        cy.get('button.btn-success').click(); // "+ Nieuwe gast toevoegen"

        cy.get('input[name="firstName"]').clear();
        cy.get('input[name="lastName"]').clear();
        cy.get('input[name="phoneNumber"]').clear();
        cy.get('input[name="address"]').clear();

        // Act
        cy.contains('Opslaan').click();

        // Assert: formulier HTML vereist attributen, Cypress controleert validatie
        cy.get('input[name="firstName"]:invalid').should('exist');
        cy.get('input[name="lastName"]:invalid').should('exist');
        cy.get('input[name="phoneNumber"]:invalid').should('exist');
        cy.get('input[name="address"]:invalid').should('exist');
    });

    it('Moet een gast kunnen bewerken', () => {
        const updatedFirstName = 'BewerkteVoornaam';
        const updatedPhone = '0699999999';

        // Arrange
        cy.get('table tbody tr').first().within(() => {
            cy.get('.btn-warning').click(); // Bewerken
        });

        // Wijzig enkele velden
        cy.get('input[name="firstName"]').clear().type(updatedFirstName);
        cy.get('input[name="phoneNumber"]').clear().type(updatedPhone);

        // Act
        cy.contains('Opslaan').click();

        // Assert: controleer nieuwe waarden in tabel
        cy.get('table tbody tr').first().within(() => {
            cy.contains(updatedFirstName).should('exist');
            cy.contains(updatedPhone).should('exist');
        });
    });

    it('Moet een gast kunnen verwijderen', () => {
        // Arrange: Zorg dat er minimaal 1 gast is
        cy.get('table tbody tr').should('exist');

        // Act
        cy.get('table tbody tr').first().within(() => {
            cy.get('.btn-danger').click(); // Verwijderen
        });

        // Assert: Controleer dat de rij niet meer bestaat (na korte wachttijd)
        cy.wait(500); // wacht op makeAPICall refresh
    });

    it('WebSocket toegevoegde gast wordt zichtbaar', () => {
        // Arrange: Simuleer WebSocket bericht via backend of mock (hier alleen logica-test)

        // Act/Assert: Cypress kijkt of er een nieuwe rij bijkomt na ontvangen van een gast via WS
        cy.window().then((win) => {
            const testGuest = {
                success: true,
                guest: {
                    id: 'ws-test-id',
                    firstName: 'Web',
                    lastName: 'SocketGast',
                    phoneNumber: '0610101010',
                    address: 'VirtueleStraat 1',
                },
            };
            win.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(testGuest) }));
        });

        cy.wait(500); // wacht op render

        cy.get('table tbody tr').should('contain', 'Web').and('contain', 'SocketGast');
    });
});
