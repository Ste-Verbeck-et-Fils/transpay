import API_BASE_URL from "../../config.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/admin/AdminPaiements.css";
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";
import Button from "../../components/ui/Button";

const AdminPaiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const today = new Date().toISOString().split("T")[0];
  const [searchTerm, setSearchTerm] = useState("");
  const [dateDebut, setDateDebut] = useState(today);
  const [dateFin, setDateFin] = useState(today);

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get( `${API_BASE_URL}/paiements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setPaiements(response.data.data);
      }
    } catch (error) {
      console.error("Erreur fetch paiements", error);
      setFeedback({
        type: "error",
        message: "Impossible de récupérer l'historique des paiements.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "En attente";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Historique des Paiements</h2>
        </div>

        <div className="print-only print-header-pro">
          <div className="print-header-main">
            <div className="print-entity-info">
              <h1 className="print-brand">TransPay</h1>
              <p className="print-subtitle">
                SYSTÈME INTÉGRÉ DE TRANSPORT URBAIN - GOMA
              </p>
            </div>
            <div className="print-report-info">
              <h2 className="print-type">RAPPORT DE PAIEMENTS</h2>
              <p className="print-date">
                Date d'émission: {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div className="print-divider-clean"></div>
        </div>
        <div className="search-bar-wrapper no-print">
          <div className="search-input-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Référence, ID ou Date..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <label>Du</label>
              <input
                type="date"
                className="filter-date-input"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Au</label>
              <input
                type="date"
                className="filter-date-input"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
            {(dateDebut || dateFin) && (
              <button
                className="clear-filter-btn"
                onClick={() => {
                  setDateDebut("");
                  setDateFin("");
                }}
                title="Effacer les dates"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            )}
          </div>

          <Button
            text="Imprimer"
            icon="printer"
            onClick={handlePrint}
            className="print-button-small"
          />
        </div>

        {feedback.message && (
          <Feedback
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback({ type: "", message: "" })}
          />
        )}

        <div className="admin-table-container">
          {loading ? (
            <Loading
              title="Chargement des transactions"
              description="Récupération des données financières..."
            />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Itinéraire / Bus</th>
                  <th>Montant</th>
                  <th>Référence</th>
                  <th>Date & Heure</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {paiements.filter((p) => {
                  const searchStr = searchTerm.toLowerCase();
                  const dateStr = p.date_paiement
                    ? new Date(p.date_paiement).toLocaleDateString("fr-FR")
                    : "";
                  const pId = p.paiement_id?.toString() || "";
                  const ref = p.reference_transaction?.toLowerCase() || "";

                  const matchesSearch =
                    ref.includes(searchStr) ||
                    pId.includes(searchStr) ||
                    dateStr.includes(searchStr);

                  let matchesDate = true;
                  if (p.date_paiement) {
                    const pDate = new Date(p.date_paiement)
                      .toISOString()
                      .split("T")[0];
                    if (dateDebut && pDate < dateDebut) matchesDate = false;
                    if (dateFin && pDate > dateFin) matchesDate = false;
                  } else if (dateDebut || dateFin) {
                    matchesDate = false;
                  }

                  return matchesSearch && matchesDate;
                }).length > 0 ? (
                  paiements
                    .filter((p) => {
                      const searchStr = searchTerm.toLowerCase();
                      const dateStr = p.date_paiement
                        ? new Date(p.date_paiement).toLocaleDateString("fr-FR")
                        : "";
                      const pId = p.paiement_id?.toString() || "";
                      const ref = p.reference_transaction?.toLowerCase() || "";

                      const matchesSearch =
                        ref.includes(searchStr) ||
                        pId.includes(searchStr) ||
                        dateStr.includes(searchStr);

                      let matchesDate = true;
                      if (p.date_paiement) {
                        const pDate = new Date(p.date_paiement)
                          .toISOString()
                          .split("T")[0];
                        if (dateDebut && pDate < dateDebut) matchesDate = false;
                        if (dateFin && pDate > dateFin) matchesDate = false;
                      } else if (dateDebut || dateFin) {
                        matchesDate = false;
                      }

                      return matchesSearch && matchesDate;
                    })
                    .map((p) => (
                      <tr key={p.paiement_id}>
                        <td>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <strong>{p.utilisateur_nom}</strong>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--text-muted)",
                              }}
                            >
                              {p.utilisateur_telephone}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>
                              {p.point_depart} → {p.point_arrivee}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--text-muted)",
                              }}
                            >
                              Bus: {p.numero_enregistrement}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontWeight: "700",
                              color: "var(--text-muted)",
                            }}
                          >
                            {p.montant} CDF
                          </span>
                        </td>
                        <td>
                          <code
                            style={{
                              fontSize: "13px",
                              background: "#f1f5f9",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {p.reference_transaction}
                          </code>
                        </td>
                        <td style={{ fontSize: "14px" }}>
                          {formatDate(p.date_paiement)}
                        </td>
                        <td>
                          <span
                            className={`badge badge-${p.statut === "reussi" ? "actif" : "hors_service"}`}
                          >
                            {p.statut}
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--text-muted)",
                      }}
                    >
                      Aucune transaction trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="print-only print-footer-pro">
          <div className="print-footer-line"></div>
          <p className="print-footer-text">
            Cette application a été développée par les étudiants de l'ISIG-GOMA
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPaiements;
