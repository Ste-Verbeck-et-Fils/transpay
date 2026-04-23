import API_BASE_URL from "../config.js";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/busScan.css";
import scanBusImg from "../assets/images/scan_bus.png";

const Scan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [busIdentifier, setBusIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedTrajet = location.state?.trajet;

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
      handleIdentification(decodedText);
    }

    function onScanFailure(error) {}

    return () => {
      scanner.clear();
    };
  }, []);

  const handleIdentification = async (identifier) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch( `${API_BASE_URL}/bus/identify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ identifier: identifier || busIdentifier }),
      });

      const data = await response.json();
      if (data.success) {
        navigate("/paiement", {
          state: {
            bus: data.data,
            trajet: selectedTrajet,
          },
        });
      } else {
        setError(data.message || "Bus introuvable.");
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
          <h1>Scannez le code QR</h1>
          <p>Alignez le code dans le cadre ci-dessous</p>
        </header>

        <div className="scanner-box">
          <img
            src={scanBusImg}
            alt="Bus identification"
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
              placeholder="Ex: TP-8842"
              className="manual-input"
              value={busIdentifier}
              onChange={(e) => setBusIdentifier(e.target.value.toUpperCase())}
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

          <button
            className="btn-validate"
            onClick={() => handleIdentification()}
            disabled={isLoading}
          >
            {isLoading ? "Vérification..." : "Valider le code"}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Scan;
