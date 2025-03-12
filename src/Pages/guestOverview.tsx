interface Guest {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
}

function fetchGuests(): Promise<Guest[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { name: "Jan Jansen", email: "jan.jansen@example.com" },
                { name: "Maria Smit", email: "maria.smit@example.com" }
            ]);
        }, 1000);
    });
}

async function populateGuestTable() {
    const tableBody = document.getElementById("guests-table-body") as HTMLElement;
    try {
        const guests = await fetchGuests();
        guests.forEach((guest) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${guest.name}</td>
                <td>${guest.email}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fout bij het ophalen van gasten:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateGuestTable();
});