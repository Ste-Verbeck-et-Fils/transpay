import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/ticket.css";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get data from navigation state (reference or paiement_id)
  const { paiement_id, reference } = location.state || {};

  useEffect(() => {
    // In a real app, we would use the real paiement_id.
    // Here we simulate the generation if we have a reference or we are coming from payment.
    const fetchOrCreateTicket = async () => {
      try {
        setLoading(true);
        
        // We simulate getting the paiement_id 18 from the user request example if none provided
        const targetPaiementId = paiement_id || 18; 
        
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Attempt to generate the ticket
        try {
          const response = await axios.post(
            "http://localhost:5000/api/tickets/generate",
            { paiement_id: targetPaiementId },
            config
          );
          setTicket(response.data.data);
        } catch (err) {
          // If already exists, fetch it
          if (err.response && err.response.status === 400) {
            const fetchResponse = await axios.get(
              `http://localhost:5000/api/tickets/paiement/${targetPaiementId}`,
              config
            );
            setTicket(fetchResponse.data.data);
          } else {
            throw err;
          }
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Impossible de charger le ticket. Veuillez vérifier votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateTicket();
  }, [paiement_id]);

  if (loading) {
    return (
      <section className="ticket-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Génération de votre ticket...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (error || !ticket) {
    return (
      <section className="ticket-page">
        <Header />
        <div className="error-container">
          <i className="bi bi-exclamation-triangle"></i>
          <h2>Oups !</h2>
          <p>{error || "Ticket introuvable."}</p>
          <button className="btn-pdf" onClick={() => navigate("/home")}>Retour à l'accueil</button>
        </div>
        <Footer />
      </section>
    );
  }

  // Format date
  const dateGen = new Date(ticket.date_generation);
  const formattedDate = dateGen.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = dateGen.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get initials for avatar
  const initials = ticket.nom_complet
    ? ticket.nom_complet.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "TP";

  return (
    <section className="ticket-page">
      <Header />
      
      <div className="ticket-container">
        {/* Main Ticket Card */}
        <div className="ticket-card">
          <div className="ticket-header-info">
            <div className="route-info">
              <div className="point">
                <span className="label">DE</span>
                <span className="value">{ticket.point_depart}</span>
              </div>
              <div className="route-arrow">
                <i className="bi bi-arrow-right"></i>
              </div>
              <div className="point" style={{ textAlign: 'right', marginLeft: 'auto' }}>
                <span className="label">À</span>
                <span className="value">{ticket.point_arrivee.split(',')[0]}</span>
              </div>
            </div>
          </div>

          <div className="user-info-row">
            <div className="user-avatar-circle">{initials}</div>
            <span className="user-name">{ticket.nom_complet}</span>
          </div>

          <div className="qr-section">
            <div className="qr-wrapper">
              <QRCodeCanvas 
                value={ticket.code_ticket} 
                size={200}
                level={"H"}
                includeMargin={true}
                imageSettings={{
                  src: "/favicon.ico", // Using favicon as placeholder for avatar in center if needed
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            <div className="ticket-id-display">
              TKT - {ticket.code_ticket.split('|').pop()}
            </div>
          </div>
        </div>

        <div className="dashed-divider"></div>

        {/* Details Card */}
        <div className="ticket-card ticket-details-card">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Date</span>
              <span className="value">{formattedDate}</span>
            </div>
            <div className="detail-item right">
              <span className="label">Heure</span>
              <span className="value">{formattedTime}</span>
            </div>
          </div>

          <div className="price-row">
            <span className="label">Prix</span>
            <span className="value">
              {Number(ticket.montant || 1500).toLocaleString('fr-FR')} <span className="unit">CDF</span>
            </span>
          </div>

          <div className="info-alert">
            <i className="bi bi-info-circle"></i>
            <p>Valable pour un trajet unique. Présentez le code à la montée.</p>
          </div>

          <div className="ticket-actions">
            <button className="btn-share">
              <i className="bi bi-share"></i> Partager le ticket
            </button>
            <button className="btn-pdf">
              <i className="bi bi-download"></i> Enregistrer en PDF
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Ticket;
