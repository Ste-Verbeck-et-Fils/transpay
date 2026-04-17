import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (error) {
      console.error('Erreur fetch tickets', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Consultation des Tickets</h2>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Code Ticket</th>
                <th>Bus</th>
                <th>Montant</th>
                <th>Généré le</th>
                <th>Expire le</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.ticket_id}>
                  <td>{t.ticket_id}</td>
                  <td>{t.utilisateur_nom}</td>
                  <td>{t.code_ticket}</td>
                  <td>{t.bus}</td>
                  <td>{t.montant} CDF</td>
                  <td>{new Date(t.date_generation).toLocaleString()}</td>
                  <td>{new Date(t.date_expiration).toLocaleString()}</td>
                  <td>{t.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default AdminTickets;
