import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import "../styles/home.css";

import busHero from "../assets/images/bus.png";
import taxiChauffeur from "../assets/images/taxichauffeur.png";
import mapRDC from "../assets/images/carte_rdc.png";
import scanBus from "../assets/images/scan_bus.png";

const Home = () => {
  return (
    <div className="home-container">
      <Header />

      <main className="home-main">
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${busHero})` }}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>Kinetic Precision for Goma</h1>
              <p>
                Simplifiez vos déplacements urbains avec le système de paiement
                le plus sécurisé et le plus rapide du Congo.
              </p>
            </div>
          </div>
        </section>

        <div className="features-wrapper">
          <section className="features-grid">
            <div className="feature-card white-card recharge-card">
              <div className="icon-wrapper">
                <i className="bi bi-wallet2"></i>
              </div>
              <h3>Recharger</h3>
              <p>
                Approvisionnez votre compte instantanément via Mobile Money ou
                Carte.
              </p>
              <div className="card-action">
                <Button text="Ajouter des fonds" variant="primary" />
              </div>
            </div>

            <div className="feature-card orange-card rapid-payment">
              <div className="card-info">
                <h3>Rapid payment</h3>
                <p>
                  Scannez le code QR à bord pour payer en moins de 2 secondes.
                </p>
                <div className="card-action">
                  <button className="btn-custom btn-white">Scanner QR</button>
                </div>
              </div>
            </div>

            <div className="feature-card white-card ticket-card">
              <div className="icon-wrapper">
                <i className="bi bi-ticket-perforated"></i>
              </div>
              <h3>Digital Ticket</h3>
              <p>Vos titres de transport toujours à portée de main.</p>
              <div className="ticket-footer">
                <span>Trajets restants</span>
                <span className="count">12</span>
              </div>
            </div>

            <div className="feature-card white-card security-card">
              <div className="icon-wrapper">
                <i className="bi bi-shield-lock"></i>
              </div>
              <h3>Security</h3>
              <p>Transactions cryptées et sécurisées par protocole bancaire.</p>
              <div className="avatar-group">
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar"></div>
              </div>
            </div>
          </section>
        </div>

        <section className="chauffeur-section">
          <div className="chauffeur-wrapper">
            <div className="chauffeur-content">
              <div className="chauffeur-text">
                <h2>Chauffeur ?</h2>
                <p>
                  Rejoignez la révolution de la mobilité à Goma. Gérez vos
                  recettes en temps réel et sécurisez vos gains quotidiens sans
                  manipuler d'espèces.
                </p>
                <div className="chauffeur-actions">
                  <Button
                    text="DEVENIR PARTENAIRE"
                    variant="primary"
                    className="chauffeur-btn"
                  />
                  <button className="btn-custom btn-white chauffeur-btn">
                    EN SAVOIR PLUS
                  </button>
                </div>
              </div>
              <div className="chauffeur-image-container">
                <img
                  src={taxiChauffeur}
                  alt="Chauffeur"
                  className="chauffeur-img"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="tracking-section">
          <div className="tracking-content">
            <div className="map-container">
              <img src={mapRDC} alt="Congo Map" className="map-img" />
            </div>
            <div className="tracking-info">
              <h2>Suivez vos bus en temps réel</h2>
              <div className="bus-status-card bus-ontime">
                <div className="status-icon orange-icon">
                  <i className="bi bi-bus-front"></i>
                </div>
                <div className="status-details">
                  <h4>Ligne 04 - Virunga Express</h4>
                  <p>Arrivée prévue dans 4 min</p>
                </div>
                <div className="status-badge ontime-badge">A L'HEURE</div>
              </div>
              <div className="bus-status-card bus-delayed">
                <div className="status-icon red-icon">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <div className="status-details">
                  <h4>Ligne 12 - Katindo Sud</h4>
                  <p>Ralentissement - Travaux en cours</p>
                </div>
                <div className="status-badge delayed-badge">+15 MIN</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
