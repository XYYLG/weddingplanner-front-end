import React from "react";
import { useState, useEffect } from "react";
import Navbar from '../../Component/Navbar';
import GuestList from '../../Component/Guestlist-component';
import './Guest.css';

function Guest() {
    return (
        <div className="Guest">
            <Navbar />
            <GuestList />
        </div>
    );
}

export default Guest;
