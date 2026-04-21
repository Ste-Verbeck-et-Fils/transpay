import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/admin.css";
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";
import Button from "../../components/ui/Button";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Erreur fetch users", error);
      setFeedback({
        type: "error",
        message: "Impossible de charger les utilisateurs.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFeedback({ type: "success", message: "Rôle mis à jour." });
      fetchUsers();
    } catch (error) {
      console.error("Erreur update role", error);
      setFeedback({
        type: "error",
        message: "Erreur lors du changement de rôle.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/${id}/status`,
        { statut: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFeedback({ type: "success", message: "Statut du compte mis à jour." });
      fetchUsers();
    } catch (error) {
      console.error("Erreur update status", error);
      setFeedback({
        type: "error",
        message: "Erreur lors du changement de statut.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
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
          <h2>Gestion des Utilisateurs</h2>
        </div>
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Quel utilisateur cherchez-vous ?"
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
            <Loading title="Chargement" description="Accès aux comptes..." />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Inscription</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => 
                  user.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  user.telephone.includes(searchTerm)
                ).length > 0 ? (
                  users
                    .filter(user => 
                      user.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      user.telephone.includes(searchTerm)
                    )
                    .map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "var(--primary-color)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "12px",
                            }}
                          >
                            {user.nom_complet.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: "600" }}>
                            {user.nom_complet}
                          </span>
                        </div>
                      </td>
                      <td>{user.telephone}</td>
                      <td>
                        <select
                          className="admin-select"
                          value={user.role}
                          style={{
                            width: "120px",
                            padding: "4px 8px",
                            fontSize: "12px",
                          }}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          disabled={updatingId === user.id}
                        >
                          <option value="passager">Passager</option>
                          <option value="controleur">Contrôleur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className="admin-select"
                          value={user.statut}
                          style={{
                            width: "100px",
                            padding: "4px 8px",
                            fontSize: "12px",
                            color:
                              user.statut === "actif"
                                ? "var(--success-text)"
                                : "var(--error-text)",
                            fontWeight: "600",
                          }}
                          onChange={(e) =>
                            handleStatusChange(user.id, e.target.value)
                          }
                          disabled={updatingId === user.id}
                        >
                          <option value="actif">Actif</option>
                          <option value="inactif">Inactif</option>
                        </select>
                      </td>
                      <td
                        style={{ fontSize: "13px", color: "var(--text-muted)" }}
                      >
                        {formatDate(user.date_creation)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      Aucun utilisateur.
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

export default AdminUsers;
