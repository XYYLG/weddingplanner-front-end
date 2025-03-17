// Correcte Guest-interface
interface Guest {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
}

// Simuleer het ophalen van gastgegevens
function fetchGuests(): Promise<Guest[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    firstname: "Jan",
                    lastname: "Jansen",
                    phoneNumber: "0612345678",
                    email: "jan.jansen@example.com",
                    address: "Damrak 1",
                    postalCode: "1012AB",
                    city: "Amsterdam"
                },
                {
                    firstname: "Maria",
                    lastname: "Smit",
                    phoneNumber: "0687654321",
                    email: "maria.smit@example.com",
                    address: "Hoofdstraat 5",
                    postalCode: "1234CD",
                    city: "Rotterdam"
                }
            ]);
        }, 1000);
    });
}

// Vul de tabel met gastgegevens
async function populateGuestTable() {
    const tableBody = document.getElementById("guests-table-body") as HTMLElement;

    // Controleer of de tabel bestaat
    if (!tableBody) {
        console.error("Kan de tabel niet vinden in de DOM.");
        return;
    }

    try {
        // Haal de gasten op
        const guests = await fetchGuests();

        // Maak rijen voor elke gast
        guests.forEach((guest) => {
            const row = document.createElement("tr");

            // Dynamisch rijen maken
            row.innerHTML = `
                <td>${guest.firstname} ${guest.lastname}</td>
                <td>${guest.phoneNumber}</td>
                <td>${guest.email}</td>
                <td>${guest.address}</td>
                <td>${guest.postalCode}</td>
                <td>${guest.city}</td>
            `;

            // Voeg de rij toe aan de tabel
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fout bij het ophalen of verwerken van gasten:", error);
    }
}

// Wacht tot de DOM is geladen
document.addEventListener("DOMContentLoaded", () => {
    populateGuestTable();
});
