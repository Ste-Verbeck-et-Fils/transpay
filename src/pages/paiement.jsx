import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "../styles/paiement.css";

const operators = [
  { id: "airtel", name: "Airtel", short: "A", status: "default" },
  { id: "mpesa", name: "M-Pesa", short: "M", status: "default" },
  { id: "orange", name: "Orange", short: "O", status: "default" },
];

const busDetails = {
  line: "Rond-Point BDGL - Birere",
  busCode: "BUS-TX-024",
  seat: "Siège 08",
  departure: "24 Oct 2024, 14:30",
  reference: "TXN-GOMA-2024-001",
  amount: "500 CDF",
};

const TripSummary = () => (
  <article className="trip-summary-card">
    <header className="trip-summary-header">
      <div>
        <p className="trip-label">Details du trajet</p>
        <h3 className="trip-title">Rond-Point BDGL</h3>
      </div>
      <div className="trip-price">{busDetails.amount}</div>
    </header>
    <div className="trip-route">
      <p>
        <span className="route-bullet start"></span>De <strong>Rond-Point BDGL</strong>
      </p>
      <p>
        <span className="route-bullet end"></span>A <strong>Birere</strong>
      </p>
    </div>
    <span className="live-status">En direct</span>
  </article>
);

const OperatorCard = ({ operator, selected, onSelect }) => (
  <button
    type="button"
    className={`operator-card ${selected ? "active" : ""}`}
    onClick={() => onSelect(operator.id)}
  >
    <span className={`operator-logo ${operator.id}`}>{operator.short}</span>
    <span className="operator-name">{operator.name}</span>
  </button>
);

const PaymentResultSuccess = ({ onTicket, onBack, methodLabel }) => (
  <article className="payment-result-card">
    <div className="result-icon success">
      <i className="bi bi-check-lg"></i>
    </div>
    <h2>Paiement réussi !</h2>
    <p className="result-subtitle">Votre transaction a été traitée avec succès dans le réseau TransPay Goma.</p>

    <div className="result-details">
      <div className="result-amount-row">
        <span>MONTANT PAYÉ</span>
        <strong>{busDetails.amount}</strong>
      </div>
      <div className="result-row">
        <span>Référence</span>
        <strong>{busDetails.reference}</strong>
      </div>
      <div className="result-row">
        <span>Date & Heure</span>
        <strong>{busDetails.departure}</strong>
      </div>
      <div className="result-row">
        <span>Méthode</span>
        <strong>{methodLabel}</strong>
      </div>
    </div>

    <Button text="Voir mon ticket" icon="ticket-perforated" className="pay-btn" onClick={onTicket} />
    <Button text="Retour à l'accueil" variant="secondary" className="secondary-action-btn" onClick={onBack} />
  </article>
);

const PaymentResultFailed = ({ onRetry, onBack }) => (
  <article className="payment-result-card">
    <div className="result-icon failed">
      <i className="bi bi-exclamation-lg"></i>
    </div>
    <h2>Échec du paiement</h2>
    <p className="result-subtitle">Solde insuffisant ou délai dépassé</p>

    <div className="error-card">
      <h3>
        <i className="bi bi-exclamation-circle"></i> Détails de l&apos;erreur
      </h3>
      <p>Veuillez vérifier le solde de votre compte mobile money ou relancer la transaction si le délai a expiré.</p>
    </div>

    <Button text="Réessayer" icon="arrow-clockwise" className="pay-btn" onClick={onRetry} />
    <Button text="Retour" variant="secondary" className="secondary-action-btn" onClick={onBack} />
    <button type="button" className="support-link-btn">
      Contacter le support <i className="bi bi-arrow-right"></i>
    </button>
  </article>
);

function Paiement() {
  const navigate = useNavigate();
  const [selectedOperator, setSelectedOperator] = useState("airtel");
  const [phone, setPhone] = useState("");
  const [paymentState, setPaymentState] = useState("form");

  const canSubmit = phone.replace(/\D/g, "").length >= 9;

  const handleConfirmPayment = () => {
    if (!canSubmit || paymentState === "loading") return;

    setPaymentState("loading");
    window.setTimeout(() => {
      const isSuccess = Math.random() >= 0.5;
      setPaymentState(isSuccess ? "success" : "failed");
    }, 1400);
  };

  const resetForm = () => {
    setPaymentState("form");
  };

  return (
    <section className="paiement-page">
      <div className="paiement-device">
        {paymentState === "success" ? (
          <PaymentResultSuccess
            methodLabel="Mobile Wallet"
            onTicket={() => navigate("/ticket")}
            onBack={() => navigate("/home")}
          />
        ) : paymentState === "failed" ? (
          <PaymentResultFailed onRetry={resetForm} onBack={() => navigate("/home")} />
        ) : (
          <>
            <header className="paiement-topbar">
              <h1>TransPay</h1>
              <button type="button" className="menu-icon-btn" aria-label="Ouvrir le menu">
                <i className="bi bi-list"></i>
              </button>
            </header>

            <TripSummary />

            <section className="paiement-block">
              <h2>Choisir l&apos;operateur</h2>
              <div className="operator-list">
                {operators.map((operator) => (
                  <OperatorCard
                    key={operator.id}
                    operator={operator}
                    selected={selectedOperator === operator.id}
                    onSelect={setSelectedOperator}
                  />
                ))}
              </div>
            </section>

            <section className="paiement-block">
              <h2>Numero Mobile Money</h2>
              <Input
                isPhone={true}
                type="tel"
                placeholder="000 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="input-helper">
                Entrez le numero associe a votre compte {selectedOperator} pour valider le paiement par notification PUSH.
              </p>
            </section>

            <article className="payment-security">
              <i className="bi bi-shield-check"></i>
              <div>
                <h3>Paiement 100% rassurant</h3>
                <p>
                  Cryptage SSL de bout en bout et validation securisee par code PIN sur votre telephone.
                </p>
              </div>
            </article>

            <Button
              text={paymentState === "loading" ? "Traitement..." : "Payer maintenant"}
              type="button"
              className="pay-btn payment-submit"
              disabled={!canSubmit || paymentState === "loading"}
              isLoading={paymentState === "loading"}
              onClick={handleConfirmPayment}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default Paiement;

