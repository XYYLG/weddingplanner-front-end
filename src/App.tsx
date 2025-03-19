import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [guests, setGuests] = useState<{
    firstName: string;
    lastName: string
    phoneNumber: string
    address: string
  }[]>([]);


  const makeAPICall = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8080/guest', { mode: 'cors' });
      const data = await response.json();
      console.log(data);

      setGuests(data);
      console.log(guests);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("updated", guests);
  }, [guests]);

  useEffect(() => {
    makeAPICall();
  }, []);

  return (
    <div className="guests-container">
      <h1 >Gasten Overzicht</h1>
      <table>
        <thead>
          <tr>
            <th>Voornaam</th>
            <th>Achternaam</th>
            <th>Telefoonnummer</th>
            <th>Adres</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => (
            <tr key={index}>
              <td>{guest.firstName}</td>
              <td>{guest.lastName}</td>
              <td>{guest.phoneNumber}</td>
              <td>{guest.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
