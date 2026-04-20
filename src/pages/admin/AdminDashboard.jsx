import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Gestion des Trajets",
      desc: "Configurez les points de départ, d'arrivée et les tarifs des voyages.",
      icon: "bi-map",
      path: "/admin/trajets"
    },
    {
      title: "Gestion des Bus",
      desc: "Administrez la flotte de bus, leurs capacités et leurs propriétaires.",
      icon: "bi-bus-front",
      path: "/admin/bus"
    },
    {
      title: "Consultation Paiements",
      desc: "Suivez en temps réel toutes les transactions effectuées sur la plateforme.",
      icon: "bi-credit-card",
      path: "/admin/paiements"
    },
    {
      title: "Consultation Tickets",
      desc: "Visualisez et vérifiez l'ensemble des tickets de transport générés.",
      icon: "bi-ticket-detailed",
      path: "/admin/tickets"
    }
  ];

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Tableau de Bord</h2>
        </div>
        
        <div className="dashboard-grid">
          {menuItems.map((item, index) => (
            <div key={index} className="stat-card" onClick={() => navigate(item.path)}>
              <i className={`bi ${item.icon}`}></i>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
