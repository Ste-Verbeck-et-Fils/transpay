import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/profile.css";

// Assets
import taxiChauffeur from "../assets/images/taxichauffeur.png";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserData({
            name: data.user.nom_complet,
            phone: data.user.telephone,
            trajets: "128", // These could be fetched separately
            eco: "15.5k",
            points: "2.4k",
            identite: data.user.nom_complet.split(' ').map(n => n[0]).join('. '),
            membre: "Jan. 2023", // Could be from user data
          });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erreur de chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Ignore logout error
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!userData) {
    return <div>Utilisateur non trouvé</div>;
  }

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
          <div className="logout-btn" onClick={handleLogout}>
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
