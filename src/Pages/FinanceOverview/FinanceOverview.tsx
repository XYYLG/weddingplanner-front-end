import React from 'react';
import Navbar from '../../Component/Navbar';
import FinanceOverviewComponent from '../../Component/FinanceOverview-component';
import './FinanceOverview.css';

const FinanceOverview: React.FC = () => {
    return (
        <div className="FinanceOverview">
            <Navbar />
            <div className="page-wrapper">
                <div className="container">
                    <FinanceOverviewComponent />
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;
