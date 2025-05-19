import React from "react";
import Navbar from '../../Component/Navbar';
import GuestList from "../../Component/GuestList-component";
import './Guest.css';

const Guest: React.FC = () => {
    return (
        <div className="Guest">
            <Navbar />
            <div className="page-wrapper">
                <div className="container">
                    <GuestList />
                </div>
            </div>
        </div>
    );
};

export default Guest;
