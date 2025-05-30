import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Guest {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
}

const GuestList: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [newGuest, setNewGuest] = useState<Omit<Guest, 'id'>>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
    });

    const [editGuest, setEditGuest] = useState<Guest | null>(null);
    const [showForm, setShowForm] = useState(false);

    const makeAPICall = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8081/guest', { mode: 'cors' });
            if (!response.ok) throw new Error('Fout bij ophalen van gegevens!');
            const data: Guest[] = await response.json();
            setGuests(data);
        } catch (e) {
            console.error('Fout bij ophalen van gegevens:', e);
        }
    };

    const createGuest = async (guest: Omit<Guest, 'id'>): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8081/guest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(guest),
            });
            if (!response.ok) throw new Error('Fout bij aanmaken van gast!');
            makeAPICall();
            setShowForm(false);
        } catch (error) {
            console.error('Netwerkfout bij het aanmaken van gast:', error);
        }
    };

    const updateGuest = async (id: string, guest: Omit<Guest, 'id'>): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:8081/guest/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(guest),
            });
            if (!response.ok) throw new Error('Fout bij bijwerken van gast!');
            makeAPICall();
            setShowForm(false);
        } catch (error) {
            console.error('Netwerkfout bij bijwerken van gast:', error);
        }
    };

    const deleteGuest = async (id: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:8081/guest/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Fout bij verwijderen van gast!');
            console.log(`Gast met ID ${id} succesvol verwijderd`);
            makeAPICall();
        } catch (error) {
            console.error('Netwerkfout bij verwijderen van gast:', error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewGuest({ ...newGuest, [name]: value });
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Formulier verzonden!"); // Debug-log toegevoegd

        if (newGuest.firstName && newGuest.lastName && newGuest.phoneNumber && newGuest.address) {
            console.log("Gastgegevens:", newGuest); // Laat zien wat wordt verzonden

            try {
                if (editGuest) {
                    await updateGuest(editGuest.id, newGuest);
                } else {
                    await createGuest(newGuest);
                }
                setNewGuest({ firstName: '', lastName: '', phoneNumber: '', address: '' });
                setEditGuest(null);
                setShowForm(false); // Sluit de modal na een succesvolle actie
            } catch (error) {
                console.error("Fout bij opslaan:", error);
            }
        } else {
            console.error('Alle velden zijn verplicht!');
        }
    };

    const handleEditClick = (guest: Guest) => {
        setNewGuest({ firstName: guest.firstName, lastName: guest.lastName, phoneNumber: guest.phoneNumber, address: guest.address });
        setEditGuest(guest);
        setShowForm(true);
    };

    useEffect(() => {
        makeAPICall();
    }, []);

    return (
        <div className="App">
            <div className="guests-container">
                <h1>Gasten Overzicht</h1>
                {showForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{editGuest ? 'Gast Bijwerken' : 'Nieuwe Gast Aanmaken'}</h2>
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Voornaam"
                                    value={newGuest.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Achternaam"
                                    value={newGuest.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Telefoonnummer"
                                    value={newGuest.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Adres"
                                    value={newGuest.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="submit">Opslaan</button>
                                <button type="button" onClick={() => { setShowForm(false); setEditGuest(null); }}>
                                    Annuleren
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                <table>
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                <div className="table-header">
                                    <button className="add-guest-btn" onClick={() => {
                                        setShowForm(true);
                                    }}>
                                        <i className="fa-solid fa-plus"></i> Nieuwe gast toevoegen
                                    </button>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th>Voornaam</th>
                            <th>Achternaam</th>
                            <th>Telefoonnummer</th>
                            <th>Adres</th>
                            <th>Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest) => (
                            <tr key={guest.id}>
                                <td>{guest.firstName}</td>
                                <td>{guest.lastName}</td>
                                <td>{guest.phoneNumber}</td>
                                <td>{guest.address}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditClick(guest)}>
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                    <button className="delete-btn" onClick={() => deleteGuest(guest.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuestList;
