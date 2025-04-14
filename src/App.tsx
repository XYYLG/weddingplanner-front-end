import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [guests, setGuests] = useState<
    { id: string; firstName: string; lastName: string; phoneNumber: string; address: string }[]
  >([]);

  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
  });

  const [showForm, setShowForm] = useState(false);

  const makeAPICall = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/guest', { mode: 'cors' });
      if (!response.ok) throw new Error('Fout bij ophalen van gegevens!');
      const data = await response.json();
      setGuests(data);
    } catch (e) {
      console.error('Fout bij ophalen van gegevens:', e);
    }
  };

  const createGuest = async (guest: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  }): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/guest', {
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

  const deleteGuest = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/guest/${id}`, {
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
    if (newGuest.firstName && newGuest.lastName && newGuest.phoneNumber && newGuest.address) {
      await createGuest(newGuest);
      setNewGuest({ firstName: '', lastName: '', phoneNumber: '', address: '' });
    } else {
      console.error('Alle velden zijn verplicht!');
    }
  };

  useEffect(() => {
    makeAPICall();
  }, []);

  return (
    <div className="guests-container">
      <h1>Gasten Overzicht</h1>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nieuwe Gast Aanmaken</h2>
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
              <button type="button" onClick={() => setShowForm(false)}>
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
                <button className="add-guest-btn" onClick={() => setShowForm(true)}>
                  {/* Plus-icoon van Font Awesome */}
                  <i className="fa-solid fa-plus"></i>
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
                <button className="delete-btn" onClick={() => deleteGuest(guest.id)}>
                  Gast verwijderen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
