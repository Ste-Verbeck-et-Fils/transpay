import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/historique.css";
import axios from "axios";

const Historique = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (!userStr || !token) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(userStr);

        const response = await axios.get(`http://localhost:5000/api/paiements/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setPaiements(response.data.data);
        } else {
          setError(response.data.message || "Erreur lors de la récupération de l'historique.");
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de contacter le serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, [navigate]);

  return (
    <div className="historique-page">
      <Header />

      <main className="historique-container">
        <header className="historique-header">
          <h1>Mon Historique</h1>
          <p>Consultez vos transactions passées</p>
        </header>

        {loading ? (
          <div className="loading-view" style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className="spinner"></div>
            <p>Chargement de l'historique...</p>
          </div>
        ) : error ? (
          <div className="status-message error" style={{ background: '#fee2e2', color: '#ef4444', padding: '16px', borderRadius: '12px', fontWeight: '600' }}>
            <i className="bi bi-exclamation-circle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        ) : paiements.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-receipt"></i>
            <h3>Aucun paiement</h3>
            <p>Vous n'avez pas encore effectué de paiement.</p>
          </div>
        ) : (
          <div className="historique-list">
            {paiements.map((paiement) => {
              const dateObj = new Date(paiement.date_paiement);
              const formattedDate = dateObj.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              });
              const formattedTime = dateObj.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div key={paiement.paiement_id} className="paiement-card">
                  <div className="paiement-header">
                    <span className="paiement-date">
                      {formattedDate} à {formattedTime}
                    </span>
                    <span className="paiement-amount">
                      {Math.floor(paiement.montant)} <span className="unit">CDF</span>
                    </span>
                  </div>
                  <div className="paiement-body">
                    <div className="paiement-route">
                      <span className="point">{paiement.point_depart}</span>
                      <i className="bi bi-arrow-right"></i>
                      <span className="point">{paiement.point_arrivee.split(',')[0]}</span>
                    </div>
                    <div className="paiement-details">
                      <span>Bus: <strong>{paiement.numero_enregistrement}</strong></span>
                      <span className="paiement-ref">{paiement.reference_transaction || "N/A"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Historique;
