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

    const createFinance = async (finance: Omit<Finance, 'id'>): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8081/finance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finance),
            });
            if (!response.ok) throw new Error('Fout bij aanmaken van bedrag!');
            fetchFinances();
            setShowForm(false);
        } catch (error) {
            console.error('Netwerkfout bij het aanmaken van bedrag:', error);
        }
    };

    const updateFinance = async (id: string, finance: Omit<Finance, 'id'>): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:8081/finance/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finance),
            });
            if (!response.ok) throw new Error('Fout bij bijwerken van bedrag!');
            fetchFinances();
            setShowForm(false);
        } catch (error) {
            console.error('Netwerkfout bij bijwerken van bedrag:', error);
        }
    };

    const deleteFinance = async (id: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:8081/finance/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Fout bij verwijderen van bedrag!');
            fetchFinances();
        } catch (error) {
            console.error('Netwerkfout bij verwijderen van bedrag:', error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setNewFinance((prevFinance) => ({
            ...prevFinance,
            [name]: name === "amountPayed" || name === "amountDue" || name === "amountTotal"
                ? Number(value) // Zorg ervoor dat getallen correct worden omgezet
                : value,
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newFinance.amountPayed && newFinance.amountDue && newFinance.amountTotal && newFinance.description) {
            if (editFinance) {
                await updateFinance(editFinance.id, newFinance);
            } else {
                await createFinance(newFinance);
            }
            setNewFinance({ amountPayed: 0, amountDue: 0, amountTotal: 0, description: '', updatedAt: new Date() });
            setEditFinance(null);
        } else {
            console.error('Alle velden zijn verplicht!');
        }
    };

    const handleEditClick = (finance: Finance) => {
        setNewFinance({
            amountPayed: finance.amountPayed,
            amountDue: finance.amountDue,
            amountTotal: finance.amountTotal,
            description: finance.description,
            updatedAt: finance.updatedAt
        });
        setEditFinance(finance);
        setShowForm(true);
    };

    useEffect(() => {
        fetchFinances();
    }, []);

    return (
        <div className="FinanceOverview">
            <div className="finance-container">
                <h1>Financieel Overzicht</h1>

                <button className="add-finance-btn" onClick={() => setShowForm(true)}>
                    <i className="fa-solid fa-plus"></i> Nieuw bedrag toevoegen
                </button>

                {showForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{editFinance ? 'Bedrag Bijwerken' : 'Nieuw Bedrag Toevoegen'}</h2>
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    type="number"
                                    name="amountPayed"
                                    placeholder="Betaald bedrag"
                                    value={newFinance.amountPayed}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="amountDue"
                                    placeholder="Nog te betalen"
                                    value={newFinance.amountDue}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="amountTotal"
                                    placeholder="Totaal bedrag"
                                    value={newFinance.amountTotal}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Beschrijving (bijv. huur, dress, catering)"
                                    value={newFinance.description}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="submit">Opslaan</button>
                                <button type="button" onClick={() => { setShowForm(false); setEditFinance(null); }}>
                                    Annuleren
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <table>
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
                                    <button className="edit-btn" onClick={() => handleEditClick(finance)}>
                                        <i className="fa-solid fa-pencil"></i> Bewerken
                                    </button>
                                    <button className="delete-btn" onClick={() => deleteFinance(finance.id)}>
                                        <i className="fa-solid fa-trash"></i> Verwijderen
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinanceOverview;
