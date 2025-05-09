import React from 'react';
import './Home.css';


const Home: React.FC = () => {
    return (
        <div>
            <div className="hero-section">
                <h1>Welkom bij Uw Weddingplanner</h1>
                <p>Beheer eenvoudig uw gastenlijst en plan de perfecte dag.</p>
            </div>

            <div className="feature-section">
                <h2>Waarom onze gastenlijst?</h2>
                <p>
                    Met onze gastenlijst-tool kunt u eenvoudig uw gasten beheren, uitnodigingen versturen
                    en ervoor zorgen dat iedereen op tijd aanwezig is op uw speciale dag.
                </p>
                <ul className="features-list">
                    <li>✔ Voeg nieuwe gasten toe met gemak.</li>
                    <li>✔ Bekijk en bewerk uw gastenlijst overal.</li>
                    <li>✔ Houd adressen en contactgegevens georganiseerd.</li>
                </ul>
            </div>

            <footer className="footer">
                <p>© 2025 Uw Weddingplanner. Alle rechten voorbehouden.</p>
            </footer>
        </div>
    );
};

export default Home;
