import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/admin.css";
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";
import Button from "../../components/ui/Button";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tickets", {
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
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Quel ticket cherchez-vous ?"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            text="Imprimer l'état" 
            icon="printer" 
            onClick={handlePrint} 
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
                {tickets.filter(t => 
                  t.utilisateur_nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  t.code_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.bus.toLowerCase().includes(searchTerm.toLowerCase())
                ).length > 0 ? (
                  tickets
                    .filter(t => 
                      t.utilisateur_nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      t.code_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      t.bus.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((t) => (
                    <tr key={t.ticket_id}>
                      <td>
                        <strong>{t.utilisateur_nom}</strong>
                      </td>
                      <td>
                        <code
                          style={{
                            fontSize: "14px",
                            color: "var(--primary-hover)",
                            fontWeight: "700",
                            background: "rgba(255, 184, 0, 0.05)",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid rgba(255, 184, 0, 0.2)",
                          }}
                        >
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
      </div>
      <Footer />
    </div>
  );
};

export default AdminTickets;
