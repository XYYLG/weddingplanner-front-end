import { useEffect } from 'react';
import './App.css';


interface ApiResponse {
  key1: string;
  key2: number;
}

function App() {
  const makeAPICall = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8080/', { mode: 'cors' });
      const data: ApiResponse = await response.json();
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
