import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/admin.css";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";

const AdminBus = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [editingBus, setEditingBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initialFormState = {
    numero_enregistrement: "",
    capacite: "",
    type_bus: "Minibus Hiace",
    nom_proprietaire: "",
    statut: "actif",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/bus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setBuses(response.data.data);
      }
    } catch (error) {
      console.error("Erreur fetch bus", error);
      setFeedback({ type: "error", message: "Impossible de charger les bus." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus.id);
    setFormData({ ...bus });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce bus ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/bus/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback({ type: "success", message: "Bus supprimé avec succès." });
      fetchBuses();
    } catch (error) {
      console.error("Erreur delete", error);
      setFeedback({ type: "error", message: "Erreur lors de la suppression." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(formData.capacite) <= 0) {
      setFeedback({ type: "error", message: "La capacité doit être un nombre positif." });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingBus) {
        await axios.put(
          `http://localhost:5000/api/bus/${editingBus}`,
          formData,
          config,
        );
        setFeedback({
          type: "success",
          message: "Bus mis à jour avec succès.",
        });
      } else {
        await axios.post("http://localhost:5000/api/bus", formData, config);
        setFeedback({
          type: "success",
          message: "Nouveau bus ajouté avec succès.",
        });
      }

      setEditingBus(null);
      setFormData(initialFormState);
      fetchBuses();
    } catch (error) {
      console.error("Erreur submit", error);
      setFeedback({ type: "error", message: "Une erreur est survenue." });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Gestion des Bus</h2>
        </div>
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Quel bus cherchez-vous ?"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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

        <div className="admin-form-container">
          <h3>{editingBus ? "Modifier le Bus" : "Ajouter un nouveau Bus"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <Input
                label="Numéro d'Enregistrement"
                placeholder="Ex: 1234AB-01"
                icon="hash"
                required
                value={formData.numero_enregistrement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numero_enregistrement: e.target.value,
                  })
                }
              />
              <Input
                label="Capacité (Places)"
                type="number"
                placeholder="Ex: 18"
                icon="people"
                required
                value={formData.capacite}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseInt(val) >= 0) {
                    setFormData({ ...formData, capacite: val });
                  }
                }}
              />
              <Input
                label="Type de Bus"
                placeholder="Ex: Minibus Hiace"
                icon="info-circle"
                required
                value={formData.type_bus}
                onChange={(e) =>
                  setFormData({ ...formData, type_bus: e.target.value })
                }
              />
              <Input
                label="Propriétaire"
                placeholder="Nom du propriétaire"
                icon="person"
                required
                value={formData.nom_proprietaire}
                onChange={(e) =>
                  setFormData({ ...formData, nom_proprietaire: e.target.value })
                }
              />
              <div className="admin-select-group">
                <label>Statut</label>
                <select
                  className="admin-select"
                  value={formData.statut}
                  onChange={(e) =>
                    setFormData({ ...formData, statut: e.target.value })
                  }
                >
                  <option value="actif">Actif</option>
                  <option value="hors_service">Hors service</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="admin-form-actions">
              {editingBus && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingBus(null);
                    setFormData(initialFormState);
                  }}
                  text="Annuler"
                  disabled={submitting}
                />
              )}
              <Button
                type="submit"
                variant="primary"
                text={
                  submitting
                    ? "Traitement..."
                    : editingBus
                      ? "Enregistrer"
                      : "Créer le Bus"
                }
                disabled={submitting}
              />
            </div>
          </form>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <Loading
              title="Chargement des bus"
              description="Veuillez patienter..."
            />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>N° Enreg. / QR</th>
                  <th>Capacité</th>
                  <th>Type</th>
                  <th>Propriétaire</th>
                  <th>Statut</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.filter(b => 
                  b.numero_enregistrement.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  b.nom_proprietaire.toLowerCase().includes(searchTerm.toLowerCase())
                ).length > 0 ? (
                  buses
                    .filter(b => 
                      b.numero_enregistrement.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      b.nom_proprietaire.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: "700" }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{b.numero_enregistrement}</span>
                          <code style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ID: {b.id}</code>
                        </div>
                      </td>
                      <td>{b.capacite} places</td>
                      <td>{b.type_bus}</td>
                      <td>{b.nom_proprietaire}</td>
                      <td>
                        <span className={`badge badge-${b.statut}`}>
                          {b.statut.replace("_", " ")}
                        </span>
                      </td>
                      <td className="no-print">
                        <div className="admin-actions">
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(b)}
                            text="Modifier"
                            style={{ padding: "6px 12px", fontSize: "13px" }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--text-muted)",
                      }}
                    >
                      Aucun bus enregistré pour le moment.
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

export default AdminBus;
