import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../../Component/Navbar';
import Home from '../HomePage/Home';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FinanceOverview from '../../Component/FinanceOverview-component';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Finance-component" element={<FinanceOverview />} />
            </Routes>
        </Router>
    );
};

export default App;
