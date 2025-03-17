import { useEffect } from 'react';
import './App.css';

function App() {
  const makeAPICall = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8080/guest', { mode: 'cors' });
      const data = await response.json();
      console.log({ data });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    makeAPICall();
  }, []);

  return (
    <div className="App">
      <h1>Welkom</h1>
    </div>
  );
}

export default App;
