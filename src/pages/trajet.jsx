import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/trajet.css";

const Trajet = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trajets");
        const data = await response.json();
        if (data.success) {
          setTrajets(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Impossible de charger les trajets. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrajets();
  }, []);

  return (
    <div className="trajet-page">
      <Header />
      
      <main className="trajet-container">
        <header className="trajet-header">
          <h1>Trajets disponibles</h1>
          <p>Choisissez votre itinéraire à Goma</p>
        </header>

        <section className="search-section">
          <div className="search-bar-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input type="text" placeholder="Où allez-vous ?" className="search-input" />
          </div>
          <button className="filter-btn">
            <i className="bi bi-sliders"></i>
          </button>
        </section>

        <section className="trajets-list">
          {loading && (
            <div className="status-message loading">
              <div className="spinner"></div>
              <p>Recherche des trajets...</p>
            </div>
          )}

          {error && (
            <div className="status-message error">
              <i className="bi bi-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">Réessayer</button>
            </div>
          )}

          {!loading && !error && trajets.length === 0 && (
            <div className="status-message empty">
              <i className="bi bi-info-circle"></i>
              <p>Aucun trajet disponible pour le moment.</p>
            </div>
          )}

          {!loading && !error && trajets.map((t) => (
            <div key={t.id} className="trajet-card">
              <div className="card-header">
                <div className="journey-info">
                  <div className="point-row">
                    <div className="point-icon depart"></div>
                    <div className="point-text">
                      <span className="label">DÉPART</span>
                      <span className="value">{t.point_depart}</span>
                    </div>
                  </div>
                  <div className="journey-line"></div>
                  <div className="point-row">
                    <div className="point-icon destination"></div>
                    <div className="point-text">
                      <span className="label">DESTINATION</span>
                      <span className="value">{t.point_arrivee}</span>
                    </div>
                  </div>
                </div>
                <div className="tarif-info">
                  <span className="label">TARIF</span>
                  <div className="price">
                    <strong>{Math.floor(t.prix)}</strong>
                    <span className="currency">CDF</span>
                  </div>
                </div>
              </div>

              <div className="card-divider"></div>

              <div className="card-footer">
                <div className="frequency">
                  <i className="bi bi-clock"></i>
                  <span>Toutes les {t.duree_estimee}</span>
                </div>
                <button className="btn-choisir">Choisir</button>
              </div>
            </div>
          ))}
        </section>

        {/* Instant Payment Banner */}
        <section className="instant-payment-card">
          <div className="payment-content">
            <h3>Paiement Instantané</h3>
            <p>
              Payez vos trajets en toute sécurité<br />
              en scannant simplement le code<br />
              QR.
            </p>
          </div>
          <div className="qr-icon-wrapper">
            <div className="qr-box">
              <i className="bi bi-qr-code-scan"></i>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Trajet;
