import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Finance {
    id: string;
    amountPayed: number;
    amountDue: number;
    amountTotal: number;
    description: string;
    updatedAt: Date;
}

const FinanceOverview: React.FC = () => {
    const [finances, setFinances] = useState<Finance[]>([]);
    const [newFinance, setNewFinance] = useState<Omit<Finance, 'id'>>({
        amountPayed: 0,
        amountDue: 0,
        amountTotal: 0,
        description: '',
        updatedAt: new Date(),
    });

    const [editFinance, setEditFinance] = useState<Finance | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchFinances = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8081/finance', { mode: 'cors' });
            if (!response.ok) throw new Error('Fout bij ophalen van gegevens!');
            const data: Finance[] = await response.json();
            setFinances(data);
        } catch (e) {
            console.error('Fout bij ophalen van gegevens:', e);
        }
    };

    useEffect(() => {
        fetchFinances();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewFinance((prevFinance) => ({
            ...prevFinance,
            [name]: ["amountPayed", "amountDue", "amountTotal"].includes(name) ? Number(value) : value,
        }));
    };

    const updateFinance = async (id: string, updatedFinance: Omit<Finance, 'id'>) => {
        try {
            const response = await fetch(`http://localhost:8081/finance/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFinance),
            });
            if (!response.ok) throw new Error('Fout bij bijwerken van gegevens!');
            await fetchFinances();
        } catch (e) {
            console.error('Fout bij bijwerken van gegevens:', e);
        }
    };

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const createFinance = async (finance: Omit<Finance, 'id'>) => {
        try {
            const response = await fetch('http://localhost:8081/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finance),
            });

            if (!response.ok) throw new Error('Fout bij toevoegen van gegevens!');
            await fetchFinances();
            setErrorMessage(null); // Reset foutmelding bij succes
        } catch (e) {
            if (e instanceof Error) {
                console.log("Fout gevonden:", e.message); // Debugging log
            } else {
                console.log("Fout gevonden:", e); // Debugging log
            }
            setErrorMessage('Fout bij toevoegen van gegevens'); // Zorg dat de foutmelding zichtbaar wordt
        }
    };



    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Formulier verzonden!", newFinance);

        if (editFinance) {
            await updateFinance(editFinance.id, newFinance);
        } else {
            await createFinance(newFinance);
        }
        setNewFinance({ amountPayed: 0, amountDue: 0, amountTotal: 0, description: '', updatedAt: new Date() });
        setEditFinance(null);
        setShowForm(false);
    };

    const deleteFinance = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8081/finance/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Fout bij verwijderen van gegevens!');
            await fetchFinances();
        } catch (e) {
            console.error('Fout bij verwijderen van gegevens:', e);
        }
    };

    const handleEditClick = (finance: Finance) => {
        setEditFinance(finance);
        setNewFinance({
            amountPayed: finance.amountPayed,
            amountDue: finance.amountDue,
            amountTotal: finance.amountTotal,
            description: finance.description,
            updatedAt: new Date(finance.updatedAt),
        });
        setShowForm(true);
    };

    return (
        <div className="container mt-4">
            <h1>Financieel Overzicht</h1>

            {/* Toevoegen-knop */}
            <button className="btn btn-success mb-3" onClick={() => {
                setShowForm(true);
                setNewFinance({ amountPayed: 0, amountDue: 0, amountTotal: 0, description: '', updatedAt: new Date() });
                setEditFinance(null);
            }}>
                + Nieuw bedrag toevoegen
            </button>

            {/* Modal voor toevoegen/bewerken */}
            {showForm && (
                <div className="modal fade show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content p-4">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            console.log("Huidige foutmelding state:", errorMessage);
                            <h2>{editFinance ? 'Bedrag Bijwerken' : 'Nieuw Bedrag Toevoegen'}</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="amountPayed" className="form-label">Betaald bedrag</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="amountPayed"
                                        name="amountPayed"
                                        placeholder="Betaald bedrag"
                                        value={newFinance.amountPayed}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="amountDue" className="form-label">Nog te betalen</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="amountDue"
                                        name="amountDue"
                                        placeholder="Nog te betalen"
                                        value={newFinance.amountDue}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="amountTotal" className="form-label">Totaal bedrag</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="amountTotal"
                                        name="amountTotal"
                                        placeholder="Totaal bedrag"
                                        value={newFinance.amountTotal}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Beschrijving</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        placeholder="Beschrijving (bijv. huur, dress, catering)"
                                        value={newFinance.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Opslaan</button>
                                <button type="button" className="btn btn-secondary ms-2" onClick={() => { setShowForm(false); setEditFinance(null); }}>
                                    Annuleren
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel met financiële gegevens */}
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>Beschrijving</th>
                        <th>Betaald bedrag</th>
                        <th>Nog te betalen</th>
                        <th>Totaal bedrag</th>
                        <th>Laatste update</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {finances.map((finance) => (
                        <tr key={finance.id}>
                            <td>{finance.description}</td>
                            <td>€{finance.amountPayed.toFixed(2)}</td>
                            <td>€{finance.amountDue.toFixed(2)}</td>
                            <td>€{finance.amountTotal.toFixed(2)}</td>
                            <td>{new Date(finance.updatedAt).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(finance)}>
                                    Bewerken
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteFinance(finance.id)}>
                                    Verwijderen
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinanceOverview;
