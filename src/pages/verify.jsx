import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/verify.css";
import scanBusImg from "../assets/images/scan_bus.png";

const Verify = () => {
  const [ticketCode, setTicketCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false,
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText, decodedResult) {
      scanner.clear();
      handleVerification(decodedText);
    }

    function onScanFailure(error) {}

    return () => {
      scanner.clear();
    };
  }, []);

  const handleVerification = async (codeToVerify) => {
    const code = codeToVerify || ticketCode;
    if (!code) {
      setError("Veuillez saisir un code de ticket.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tickets/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code_ticket: code }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(
          `Statut: ${data.statut || "Erreur"} - Raison: ${data.raison || data.message || "Inconnue"}`,
        );
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scan-page">
      <Header />

      <main className="scan-container">
        <header className="scan-header">
          <h1>Vérification de Ticket</h1>
          <p>Scannez ou saisissez le code du ticket</p>
        </header>

        <div className="scanner-box">
          <img
            src={scanBusImg}
            alt="Ticket verification"
            className="scanner-bg"
          />
          <div className="scan-frame">
            <div id="reader"></div>
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
          </div>
        </div>

        <section className="manual-entry-section">
          <label>SAISIR LE CODE MANUELLEMENT</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Ex: IT345GM|3|18|9"
              className="manual-input"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
            />
            <i className="bi bi-keyboard keyboard-icon"></i>
          </div>

          {error && (
            <div
              className="status-message error"
              style={{
                marginBottom: "15px",
                background: "#fee2e2",
                color: "#ef4444",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              <i
                className="bi bi-exclamation-circle"
                style={{ marginRight: "8px" }}
              ></i>
              {error}
            </div>
          )}

          {result && result.statut === "valide" && (
            <div
              className="status-message success"
              style={{
                marginBottom: "15px",
                background: "#dcfce7",
                color: "#166534",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "14px",
                textAlign: "left",
                fontWeight: "500",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                Ticket Valide
              </div>
              <div>
                <strong>Bus:</strong> {result.numero_enregistrement}
              </div>
              <div>
                <strong>Départ:</strong> {result.point_depart}
              </div>
              <div>
                <strong>Arrivée:</strong> {result.point_arrivee}
              </div>
              <div>
                <strong>Date Exp:</strong>{" "}
                {new Date(result.date_expiration).toLocaleString()}
              </div>
            </div>
          )}

          <button
            className="btn-validate"
            onClick={() => handleVerification()}
            disabled={isLoading}
          >
            {isLoading ? "Vérification..." : "Vérifier le ticket"}
          </button>

          {result && (
            <button
              className="btn-validate"
              onClick={() => window.location.reload()}
              style={{ marginTop: "10px", backgroundColor: "#64748b" }}
            >
              Nouveau Scan
            </button>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Verify;
