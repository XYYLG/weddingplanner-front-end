import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './HomePage/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import FinanceOverview from './FinanceOverview/FinanceOverview';
import Guest from './GuestList/Guest';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Guest" element={<Guest />} />
                <Route path="/FinanceOverview" element={<FinanceOverview />} />
            </Routes>
        </Router>
    );
};

export default App;
