import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../../Component/Navbar';
import FinanceOverviewComponent from '../../Component/FinanceOverview-component';
import './FinanceOverview.css';

function FinanceOverview() {
    return (
        <div className="FinanceOverview">
            <Navbar />
            <FinanceOverviewComponent />
        </div>
    );
}
export default FinanceOverview;
