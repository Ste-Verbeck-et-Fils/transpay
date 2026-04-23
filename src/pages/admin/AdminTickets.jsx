import API_BASE_URL from "../../config.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/admin/AdminTickets.css";
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";
import Button from "../../components/ui/Button";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const today = new Date().toISOString().split("T")[0];
  const [searchTerm, setSearchTerm] = useState("");
  const [dateDebut, setDateDebut] = useState(today);
  const [dateFin, setDateFin] = useState(today);
  const [selectedStatus, setSelectedStatus] = useState("tous");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get( `${API_BASE_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (error) {
      console.error("Erreur fetch tickets", error);
      setFeedback({
        type: "error",
        message: "Impossible de récupérer les tickets.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
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
          <h2>Consultation des Tickets</h2>
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
              <h2 className="print-type">REGISTRE DES TITRES DE TRANSPORT</h2>
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
              placeholder="Client, Code ou Bus..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <label>Statut</label>
              <select
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="tous">Tous les tickets</option>
                <option value="valide">Valide</option>
                <option value="expire">Expiré</option>
                <option value="utilise">Utilisé</option>
              </select>
            </div>
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
              title="Chargement des tickets"
              description="Récupération de la base de données des titres de transport..."
            />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Code Ticket</th>
                  <th>Bus</th>
                  <th>Généré le</th>
                  <th>Expiration</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {tickets.filter((t) => {
                  const searchStr = searchTerm.toLowerCase();
                  const matchesSearch =
                    t.utilisateur_nom.toLowerCase().includes(searchStr) ||
                    t.code_ticket.toLowerCase().includes(searchStr) ||
                    t.bus.toLowerCase().includes(searchStr);

                  const matchesStatus =
                    selectedStatus === "tous" || t.statut === selectedStatus;

                  let matchesDate = true;
                  if (t.date_generation) {
                    const tDate = new Date(t.date_generation)
                      .toISOString()
                      .split("T")[0];
                    if (dateDebut && tDate < dateDebut) matchesDate = false;
                    if (dateFin && tDate > dateFin) matchesDate = false;
                  } else if (dateDebut || dateFin) {
                    matchesDate = false;
                  }

                  return matchesSearch && matchesStatus && matchesDate;
                }).length > 0 ? (
                  tickets
                    .filter((t) => {
                      const searchStr = searchTerm.toLowerCase();
                      const matchesSearch =
                        t.utilisateur_nom.toLowerCase().includes(searchStr) ||
                        t.code_ticket.toLowerCase().includes(searchStr) ||
                        t.bus.toLowerCase().includes(searchStr);

                      const matchesStatus =
                        selectedStatus === "tous" ||
                        t.statut === selectedStatus;

                      let matchesDate = true;
                      if (t.date_generation) {
                        const tDate = new Date(t.date_generation)
                          .toISOString()
                          .split("T")[0];
                        if (dateDebut && tDate < dateDebut) matchesDate = false;
                        if (dateFin && tDate > dateFin) matchesDate = false;
                      } else if (dateDebut || dateFin) {
                        matchesDate = false;
                      }

                      return matchesSearch && matchesStatus && matchesDate;
                    })
                    .map((t) => (
                      <tr key={t.ticket_id}>
                        <td>
                          <strong>{t.utilisateur_nom}</strong>
                        </td>
                        <td>
                          <code className="ticket-code-style">
                            {t.code_ticket}
                          </code>
                        </td>
                        <td>{t.bus}</td>
                        <td style={{ fontSize: "14px" }}>
                          {formatDate(t.date_generation)}
                        </td>
                        <td style={{ fontSize: "14px" }}>
                          {formatDate(t.date_expiration)}
                        </td>
                        <td>
                          <span
                            className={`badge ${t.statut === "valide" ? "badge-actif" : "badge-hors_service"}`}
                          >
                            {t.statut}
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
                      Aucun ticket généré pour le moment.
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

export default AdminTickets;
