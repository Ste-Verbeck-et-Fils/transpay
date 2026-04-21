import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Feedback from "../components/ui/Feedback";
import "../styles/ticket.css";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { paiement_id, reference, showSuccessToast } = location.state || {};

  useEffect(() => {
    const fetchOrCreateTicket = async () => {
      try {
        setLoading(true);

        const targetPaiementId = paiement_id || 18;

        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        try {
          const response = await axios.post(
            "http://localhost:5000/api/tickets/generate",
            { paiement_id: targetPaiementId },
            config,
          );
          setTicket(response.data.data);
        } catch (err) {
          if (err.response && err.response.status === 400) {
            const fetchResponse = await axios.get(
              `http://localhost:5000/api/tickets/paiement/${targetPaiementId}`,
              config,
            );
            setTicket(fetchResponse.data.data);
          } else {
            throw err;
          }
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(
          "Impossible de charger le ticket. Veuillez vérifier votre connexion.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateTicket();
  }, [paiement_id]);

  if (loading) {
    return (
      <h1 className="text-center my-4">Mon Ticket</h1>
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
          <button className="btn-pdf" onClick={() => navigate("/home")}>
            Retour à l'accueil
          </button>
        </div>
        <Footer />
      </section>
    );
  }

  const dateGen = new Date(ticket.date_generation);
  const formattedDate = dateGen.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = dateGen.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const initials = ticket.nom_complet
    ? ticket.nom_complet
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "TP";

  const handleDownloadPDF = async () => {
    const element = document.getElementById("ticket-to-print");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket_TransPay_${ticket.code_ticket.split("|").pop()}.pdf`);
    } catch (err) {
      console.error("Erreur lors de la création du PDF :", err);
      alert("Erreur lors de la création du PDF.");
    }
  };

  return (
    <section className="ticket-page">
      <Header />

      {showSuccessToast && (
        <div style={{ padding: '0 20px', marginTop: '20px', maxWidth: '600px', margin: '20px auto 0' }}>
            <Feedback 
                type="success" 
                title="Paiement Réussi !" 
                message="Votre transaction a été traitée avec succès et votre ticket est généré." 
                duration={5000} 
            />
        </div>
      )}

      <div className="ticket-container" id="ticket-to-print">
        <div className="ticket-card main-card">
          <div className="ticket-header-info">
            <div className="route-info">
              <div className="point">
                <span className="label">DE</span>
                <span className="value">{ticket.point_depart}</span>
              </div>
              <div className="route-arrow">
                <i className="bi bi-arrow-right"></i>
              </div>
              <div
                className="point"
                style={{ textAlign: "right", marginLeft: "auto" }}
              >
                <span className="label">À</span>
                <span className="value">
                  {ticket.point_arrivee.split(",")[0]}
                </span>
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
                  src: "/favicon.ico",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            <div className="ticket-id-display">{ticket.code_ticket}</div>
          </div>
        </div>

        <div className="dashed-divider"></div>

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
              {ticket.montant
                ? Number(ticket.montant).toLocaleString("fr-FR")
                : "N/A"}{" "}
              <span className="unit">CDF</span>
            </span>
          </div>

          <div className="info-alert">
            <i className="bi bi-info-circle"></i>
            <p>Valable pour un trajet unique. Présentez le code à la montée.</p>
          </div>

          <div className="ticket-actions" data-html2canvas-ignore="true">
            <button className="btn-pdf" onClick={handleDownloadPDF}>
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
