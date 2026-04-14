import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/profile.css";

// Assets
import taxiChauffeur from "../assets/images/taxichauffeur.png";

const Profile = () => {
  const userData = {
    name: "Jean-Paul Goma",
    phone: "+243 812 345 678",
    trajets: "128",
    eco: "15.5k",
    points: "2.4k",
    identite: "J.P. Goma",
    membre: "Jan. 2023",
  };

  return (
    <div className="profile-container">
      <Header />

      <main className="profile-main">
        {/* Banner Section */}
        <div className="profile-banner"></div>

        {/* User Info Section */}
        <div className="user-header">
          <div className="avatar-section">
            <div className="avatar-box">
              <img
                src={taxiChauffeur}
                alt="Jean-Paul Goma"
                className="profile-img"
              />
              <div className="edit-badge">
                <i className="bi bi-pencil-fill"></i>
              </div>
            </div>
          </div>
          <div className="user-info-text">
            <h2>{userData.name}</h2>
            <div className="user-phone">
              <i className="bi bi-telephone-fill"></i>
              <span>{userData.phone}</span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <div className="stats-header">
            <div className="stat-col">
              <span className="stat-label">TRAJETS</span>
              <span className="stat-value">{userData.trajets}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-col">
              <span className="stat-label">FC ÉCO.</span>
              <span className="stat-value green">{userData.eco}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-col">
              <span className="stat-label">POINTS</span>
              <span className="stat-value yellow">{userData.points}</span>
            </div>
          </div>

          <div className="horizontal-divider"></div>

          <div className="details-grid">
            <div className="detail-item">
              <div className="icon-box">
                <i className="bi bi-person"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">IDENTITÉ</span>
                <span className="detail-value">{userData.identite}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">STATUT</span>
                <span className="detail-value green">
                  Vérifié <i className="bi bi-check-circle-fill"></i>
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box">
                <i className="bi bi-calendar"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">MEMBRE</span>
                <span className="detail-value">{userData.membre}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">HISTORIQUE</span>
                <span className="detail-value yellow">Voir tout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="action-card">
          <div className="action-item">
            <div className="action-left">
              <div className="icon-box">
                <i className="bi bi-pencil-square"></i>
              </div>
              <span>Modifier le profil</span>
            </div>
            <i className="bi bi-chevron-right"></i>
          </div>
        </div>

        {/* Logout */}
        <div className="logout-section">
          <div className="logout-btn">
            <div className="icon-box red">
              <i className="bi bi-box-arrow-right"></i>
            </div>
            <span>Déconnexion</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
