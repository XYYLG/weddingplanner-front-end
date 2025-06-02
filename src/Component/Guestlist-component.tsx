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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewGuest({ ...newGuest, [name]: value });
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (editGuest) {
                await updateGuest(editGuest.id, newGuest);
            } else {
                await createGuest(newGuest);
            }
            setNewGuest({ firstName: '', lastName: '', phoneNumber: '', address: '' });
            setEditGuest(null);
            setShowForm(false);
        } catch (error) {
            console.error("Fout bij opslaan:", error);
        }
    };

    const updateGuest = async (id: string, updatedGuest: Omit<Guest, 'id'>) => {
        try {
            const response = await fetch(`http://localhost:8081/guest/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedGuest),
            });
            if (!response.ok) throw new Error('Fout bij bijwerken van gast!');
            await makeAPICall();
        } catch (e) {
            console.error('Fout bij bijwerken van gast:', e);
        }
    };

    const createGuest = async (guest: Omit<Guest, 'id'>) => {
        try {
            const response = await fetch('http://localhost:8081/guest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(guest),
            });
            if (!response.ok) throw new Error('Fout bij aanmaken van gast!');
            await makeAPICall();
        } catch (e) {
            console.error('Fout bij aanmaken van gast:', e);
        }
    };

    useEffect(() => {
        makeAPICall();
    }, []);

    function handleEditClick(guest: Guest): void {
        setEditGuest(guest);
        setNewGuest({
            firstName: guest.firstName,
            lastName: guest.lastName,
            phoneNumber: guest.phoneNumber,
            address: guest.address,
        });
        setShowForm(true);
    }

    const deleteGuest = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8081/guest/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Fout bij verwijderen van gast!');
            await makeAPICall();
        } catch (e) {
            console.error('Fout bij verwijderen van gast:', e);
        }
    }

    return (
        <div className="container mt-4">
            <h1>Gasten Overzicht</h1>

            {/* Knop om een nieuwe gast toe te voegen */}
            <button className="btn btn-success mb-3" onClick={() => {
                setShowForm(true);
                setNewGuest({ firstName: '', lastName: '', phoneNumber: '', address: '' });
                setEditGuest(null);
            }}>
                + Nieuwe gast toevoegen
            </button>

            {showForm && (
                <div className="modal fade show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content p-4">
                            <h2>{editGuest ? 'Gast Bijwerken' : 'Nieuwe Gast Aanmaken'}</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label">Voornaam</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Voornaam"
                                        value={newGuest.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Achternaam</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Achternaam"
                                        value={newGuest.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">Telefoonnummer</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="Telefoonnummer"
                                        value={newGuest.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Adres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        placeholder="Adres"
                                        value={newGuest.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Opslaan</button>
                                <button type="button" className="btn btn-secondary ms-2" onClick={() => { setShowForm(false); setEditGuest(null); }}>
                                    Annuleren
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <table className="table table-striped mt-3">
                <thead>
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
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(guest)}>
                                    Bewerken
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteGuest(guest.id)}>
                                    Verwijderen
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuestList;
