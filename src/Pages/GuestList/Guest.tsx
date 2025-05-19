import React from "react";
import { useState, useEffect } from "react";
import Navbar from '../../Component/Navbar';
import GuestList from "../../Component/GuestList-component";
import './Guest.css';

function Guest() {
    return (
        <div className="Guest">
            <Navbar />
            <div className="container">
                <GuestList />
            </div>
        </div>
    );
}

export default Guest;
