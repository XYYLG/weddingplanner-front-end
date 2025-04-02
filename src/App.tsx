import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [guests, setGuests] = useState([]);

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
      const data = await response.json();
      setGuests(data);
    } catch (e) {
      console.error(e);
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

      if (response.ok) {
        makeAPICall();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Netwerkfout:', error);
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

      if (response.ok) {
        console.log(`Gast met ID ${id} succesvol verwijderd`);
        makeAPICall();
      } else {
        console.error(`Fout bij het verwijderen van gast met ID ${id}`);
      }
    } catch (error) {
      console.error('Netwerkfout:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewGuest({ ...newGuest, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createGuest(newGuest);
    setNewGuest({ firstName: '', lastName: '', phoneNumber: '', address: '' });
  };

  useEffect(() => {
    makeAPICall();
  }, []);

  return (
    <div className="guests-container">
      <h1>Gasten Overzicht</h1>
      <button onClick={() => setShowForm(true)}>Create Gast</button>
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
              <button type="button" onClick={() => setShowForm(false)}>Annuleren</button>
            </form>
          </div>
        </div>
      )}
      <table>
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
          {guests.map((guest: any, index) => (
            <tr key={index}>
              <td>{guest.firstName}</td>
              <td>{guest.lastName}</td>
              <td>{guest.phoneNumber}</td>
              <td>{guest.address}</td>
              <td>
                <button
                  onClick={() => deleteGuest(guest.id)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
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
