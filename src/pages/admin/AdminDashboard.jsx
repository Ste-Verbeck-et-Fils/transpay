import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Tableau de bord Administrateur</h2>
        </div>
        <div className="dashboard-grid">
          <div className="stat-card" onClick={() => navigate('/admin/trajets')}>
            <i className="bi bi-map"></i>
            <h3>Gestion des Trajets</h3>
            <p>Ajouter, modifier ou supprimer des trajets</p>
          </div>
          <div className="stat-card" onClick={() => navigate('/admin/bus')}>
            <i className="bi bi-bus-front"></i>
            <h3>Gestion des Bus</h3>
            <p>Ajouter, modifier ou supprimer des bus</p>
          </div>
          <div className="stat-card" onClick={() => navigate('/admin/paiements')}>
            <i className="bi bi-credit-card"></i>
            <h3>Consultation Paiements</h3>
            <p>Voir l'historique des paiements</p>
          </div>
          <div className="stat-card" onClick={() => navigate('/admin/tickets')}>
            <i className="bi bi-ticket-detailed"></i>
            <h3>Consultation Tickets</h3>
            <p>Voir les tickets générés</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default AdminDashboard;
