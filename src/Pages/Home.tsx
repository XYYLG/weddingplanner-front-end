import React from 'react';
import './Home.css';
import Navbar from '../Component/Navbar';
const Home: React.FC = () => {
    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <div className="hero-section">
                <h1>Welkom bij Uw Weddingplanner</h1>
                <p>Wij maken van uw droomdag een onvergetelijke realiteit.</p>
                <button className="cta-button">Plan Nu Uw Bruiloft</button>
            </div>

            {/* Services Section */}
            <div className="services-section">
                <h2>Onze Diensten</h2>
                <div className="service-cards">
                    <div className="card">
                        <h3>Locatiekeuze</h3>
                        <p>Wij helpen u bij het vinden van de perfecte locatie.</p>
                    </div>
                    <div className="card">
                        <h3>Catering</h3>
                        <p>Van elegante diners tot heerlijke hapjes, wij regelen het.</p>
                    </div>
                    <div className="card">
                        <h3>Decoratie</h3>
                        <p>Laat uw stijl en thema tot leven komen met onze decoratieservice.</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Uw Weddingplanner. Alle rechten voorbehouden.</p>
            </footer>
        </div>
    );
};

export default Home;
