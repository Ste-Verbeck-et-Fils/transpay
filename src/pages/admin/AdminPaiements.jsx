import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';

const AdminPaiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/paiements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPaiements(response.data.data);
      }
    } catch (error) {
      console.error('Erreur fetch paiements', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Consultation des Paiements</h2>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Trajet</th>
                <th>Bus</th>
                <th>Montant</th>
                <th>Référence</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map(p => (
                <tr key={p.paiement_id}>
                  <td>{p.paiement_id}</td>
                  <td>{p.utilisateur_nom} ({p.utilisateur_telephone})</td>
                  <td>{p.point_depart} → {p.point_arrivee}</td>
                  <td>{p.numero_enregistrement}</td>
                  <td>{p.montant} CDF</td>
                  <td>{p.reference_transaction}</td>
                  <td>{new Date(p.date_paiement).toLocaleString()}</td>
                  <td>{p.statut}</td>
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
export default AdminPaiements;
