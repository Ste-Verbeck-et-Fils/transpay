import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "../styles/paiement.css";
import "../styles/busDetails.css";
import taxiChauffeurImg from "../assets/images/taxichauffeur.png";
import airtelLogo from "../assets/images/airtelmoney.png";
import mpesaLogo from "../assets/images/mpesa.jpeg";
import orangeLogo from "../assets/images/orangemoney.png";
import rdcFlag from "../assets/images/drapeau_rdc.png";

const operators = [
  { id: "airtel", name: "Airtel", logo: airtelLogo, color: "#d50e0e" },
  { id: "mpesa", name: "M-Pesa", logo: mpesaLogo, color: "#f33535" },
  { id: "orange", name: "Orange", logo: orangeLogo, color: "#ff8a00" },
];

const PaymentResultSuccess = ({ amount, reference, date, onTicket, onBack }) => (
  <article className="payment-result-card success-view">
    <div className="result-icon success">
      <div className="icon-circle">
        <i className="bi bi-check-lg"></i>
      </div>
    </div>
    <div className="result-header">
      <h2>Paiement réussi !</h2>
      <p className="result-subtitle">Votre transaction a été traitée avec succès dans le réseau TransPay Goma.</p>
    </div>

    <div className="result-details">
      <div className="result-amount-row">
        <span>MONTANT PAYÉ</span>
        <strong className="amount-gold">{Math.floor(amount)} <span className="currency">CDF</span></strong>
      </div>
      <div className="result-details-grid">
        <div className="result-row">
          <span>Référence</span>
          <strong className="ref-pill">{reference}</strong>
        </div>
        <div className="result-row">
          <span>Date & Heure</span>
          <strong>{date}</strong>
        </div>
        <div className="result-row">
          <span>Méthode</span>
          <strong className="method-box">
             <i className="bi bi-wallet2" style={{ color: '#ffb800', marginRight: '6px' }}></i> 
             Mobile Wallet
          </strong>
        </div>
      </div>
    </div>

    <div className="result-actions">
        <Button text="Voir mon ticket" icon="ticket-perforated" className="pay-btn btn-primary-yellow" onClick={onTicket} />
        <Button text="Retour à l'accueil" variant="secondary" className="secondary-action-btn btn-grey" onClick={onBack} />
    </div>
  </article>
);

const PaymentResultFailed = ({ onRetry, onBack }) => (
  <article className="payment-result-card failed-view">
    <div className="result-icon failed">
      <div className="icon-circle">
        <i className="bi bi-exclamation-lg"></i>
      </div>
    </div>
    <div className="result-header">
      <h2>Échec du paiement</h2>
      <p className="result-subtitle">Solde insuffisant ou délai dépassé</p>
    </div>

    <div className="error-card">
      <div className="error-card-header">
        <i className="bi bi-info-circle"></i>
        <h3>Détails de l'erreur</h3>
      </div>
      <p>Veuillez vérifier le solde de votre compte mobile money ou relancer la transaction si le délai a expiré.</p>
    </div>

    <div className="result-actions">
        <Button text="Réessayer" icon="arrow-clockwise" className="pay-btn btn-primary-yellow" onClick={onRetry} />
        <Button text="Retour" variant="secondary" className="secondary-action-btn btn-grey" onClick={onBack} />
    </div>

    <button type="button" className="support-link-btn">
      Contacter le support <i className="bi bi-arrow-right"></i>
    </button>
  </article>
);

function Paiement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, trajet } = location.state || {};

  const [step, setStep] = useState(location.state?.autoStart ? "form" : "details");
  const [selectedOperator, setSelectedOperator] = useState("airtel");
  const [phone, setPhone] = useState("");
  const [createdPaiementId, setCreatedPaiementId] = useState(null);

  // Fallback data
  const displayTrajet = trajet || {
    point_depart: "Rond-Point BDGL",
    point_arrivee: "Birere, Goma",
    prix: 500,
    duree_estimee: "12-15 min"
  };

  const displayBus = bus || {
    type_bus: "Minibus Hiace",
    nom_proprietaire: "JEAN-MARC VERBECK",
    numero_enregistrement: "TP-8842"
  };

  const canSubmit = phone.replace(/\D/g, "").length >= 9;

  const handleConfirmPayment = async () => {
    if (!canSubmit) return;
    setStep("loading");
    
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // 1. Create payment in DB
      const payRes = await axios.post("http://localhost:5000/api/paiements", {
        trajet_id: displayTrajet.id || 1,
        bus_id: displayBus.id || 1,
        montant: displayTrajet.prix,
        moyen_paiement: selectedOperator === "airtel" ? "airtel_money" : "m_pesa"
      }, config);

      const pId = payRes.data.data.id;
      setCreatedPaiementId(pId);

      // 2. Wait a bit for "experience"
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStep("success");
    } catch (err) {
      console.error("Payment error:", err);
      setStep("failed");
    }
  };

  const transactionDate = "24 Oct 2024, 14:30"; // Matching mockup for visual consistency
  const reference = "TXN-GOMA-2024-001";

  if (step === "details") {
    return (
      <div className="details-page">
        <Header />
        <main className="details-main">
          <div className="map-bg"></div>
          <div className="details-content">
            <section className="trajet-summary-card">
              <div className="summary-left">
                <span className="label">TRAJET SÉLECTIONNÉ</span>
                <h2>{displayTrajet.point_depart} → {displayTrajet.point_arrivee.split(',')[0]}</h2>
              </div>
              <div className="price-badge">
                <span className="amount">{Math.floor(displayTrajet.prix)}</span>
                <span className="unit">CDF</span>
              </div>
            </section>

            <section className="info-cards-group">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="dot active"></div>
                  <div className="connector"></div>
                  <div className="timeline-text">
                    <span className="label">DÉPART</span>
                    <span className="value">{displayTrajet.point_depart}</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="dot"></div>
                  <div className="timeline-text">
                    <span className="label">DESTINATION</span>
                    <span className="value">{displayTrajet.point_arrivee}</span>
                  </div>
                </div>
              </div>

              <div className="h-divider"></div>

              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-icon"><i className="bi bi-clock"></i></div>
                  <div className="metric-info">
                    <span className="m-label">TEMPS</span>
                    <span className="m-value">{displayTrajet.duree_estimee || "12-15 min"}</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon"><i className="bi bi-bus-front"></i></div>
                  <div className="metric-info">
                    <span className="m-label">TYPE</span>
                    <span className="m-value">{displayBus.type_bus}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="chauffeur-card">
              <div className="driver-info">
                <div className="driver-avatar-wrapper">
                  <img src={taxiChauffeurImg} alt="Propriétaire" className="driver-avatar" />
                  <div className="verified-icon"><i className="bi bi-check"></i></div>
                </div>
                <div className="driver-name-box">
                  <span className="d-label">PROPRIÉTAIRE</span>
                  <h3>{displayBus.nom_proprietaire}</h3>
                </div>
              </div>
              <div className="rating-box">
                <i className="bi bi-star-fill"></i>
                <span>4.9</span>
              </div>
            </section>

            <button className="btn-pay" onClick={() => setStep("form")}>
              Payer avec Mobile Money
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="paiement-page">
      <Header />
      <main className="paiement-container">
        {step === "form" ? (
          <div className="payment-form-view">
            <article className="trip-summary-block">
              <div className="block-header">
                <span className="title">DÉTAILS DU TRAJET</span>
                <span className="price">{Math.floor(displayTrajet.prix)} CDF</span>
              </div>
              <div className="block-body">
                <div className="route-minimal">
                  <div className="route-point">
                    <span className="dot yellow"></span>
                    <span className="label">DE</span>
                    <span className="value">{displayTrajet.point_depart}</span>
                  </div>
                  <div className="route-point">
                    <span className="dot active-gold"></span>
                    <span className="label">A</span>
                    <span className="value">{displayTrajet.point_arrivee.split(',')[0]}</span>
                  </div>
                </div>
                <div className="live-pill">EN DIRECT</div>
              </div>
            </article>

            <section className="selection-section">
              <h2 className="section-title">Choisir l'opérateur</h2>
              <div className="operator-flex">
                {operators.map((op) => (
                  <button
                    key={op.id}
                    className={`operator-pill ${selectedOperator === op.id ? "active" : ""}`}
                    onClick={() => setSelectedOperator(op.id)}
                  >
                    <div className="img-box">
                        <img src={op.logo} alt={op.name} />
                    </div>
                    <span>{op.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="input-section">
                <h2 className="section-title">Numéro Mobile Money</h2>
                <div className="phone-input-wrapper">
                    <div className="prefix-box">
                        <img src={rdcFlag} alt="DRC Flag" className="flag-icon" />
                        <span>+243</span>
                    </div>
                    <input 
                        type="tel" 
                        placeholder="000 000 000" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="main-phone-input"
                    />
                </div>
                <p className="help-text">
                    Entrez le numéro associé à votre compte {selectedOperator.charAt(0).toUpperCase() + selectedOperator.slice(1)} Money pour valider le paiement par notification PUSH.
                </p>
            </section>

            <article className="safety-card">
                <div className="safety-icon">
                    <i className="bi bi-shield-lock-fill"></i>
                </div>
                <div className="safety-text">
                    <h3>Paiement 100% Rassurant</h3>
                    <p>Cryptage SSL de bout en bout et validation sécurisée par code PIN sur votre téléphone.</p>
                </div>
            </article>

            <button 
                className={`btn-submit-pay ${!canSubmit ? "disabled" : ""}`}
                disabled={!canSubmit}
                onClick={handleConfirmPayment}
            >
                Payer maintenant <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        ) : step === "loading" ? (
          <div className="loading-view">
            <div className="spinner"></div>
            <h2>Traitement en cours...</h2>
            <p>Veuillez confirmer la transaction sur votre téléphone.</p>
          </div>
        ) : step === "success" ? (
          <PaymentResultSuccess 
            amount={displayTrajet.prix} 
            reference={reference} 
            date={transactionDate} 
            onTicket={() => navigate("/ticket", { state: { paiement_id: createdPaiementId } })}
            onBack={() => navigate("/home")}
          />
        ) : (
          <PaymentResultFailed 
             onRetry={() => setStep("form")} 
             onBack={() => navigate("/home")} 
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Paiement;
