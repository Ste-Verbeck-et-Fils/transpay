import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";

const AdminTrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [editingTrajet, setEditingTrajet] = useState(null);
  
  const initialFormState = { 
    point_depart: '', 
    point_arrivee: '', 
    prix: '', 
    duree_estimee: '', 
    statut: 'actif' 
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTrajets();
  }, []);

  const fetchTrajets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trajets');
      if (response.data.success) {
        setTrajets(response.data.data);
      }
    } catch (error) {
      console.error('Erreur fetch trajets', error);
      setFeedback({ type: "error", message: "Impossible de charger les trajets." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trajet) => {
    setEditingTrajet(trajet.id);
    setFormData({ ...trajet });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/trajets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback({ type: "success", message: "Trajet supprimé avec succès." });
      fetchTrajets();
    } catch (error) {
      console.error('Erreur delete', error);
      setFeedback({ type: "error", message: "Erreur lors de la suppression." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingTrajet) {
        await axios.put(`http://localhost:5000/api/trajets/${editingTrajet}`, formData, config);
        setFeedback({ type: "success", message: "Trajet mis à jour avec succès." });
      } else {
        await axios.post('http://localhost:5000/api/trajets', formData, config);
        setFeedback({ type: "success", message: "Nouveau trajet créé avec succès." });
      }
      
      setEditingTrajet(null);
      setFormData(initialFormState);
      fetchTrajets();
    } catch (error) {
      console.error('Erreur submit', error);
      setFeedback({ type: "error", message: "Une erreur est survenue lors de l'enregistrement." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Gestion des Trajets</h2>
        </div>

        {feedback.message && (
          <Feedback 
            type={feedback.type} 
            message={feedback.message} 
            onClose={() => setFeedback({ type: "", message: "" })} 
          />
        )}

        <div className="admin-form-container">
          <h3>{editingTrajet ? 'Modifier le Trajet' : 'Ajouter un nouveau Trajet'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <Input 
                label="Point de Départ" 
                placeholder="Ex: Gare Centrale" 
                icon="geo-alt" 
                required 
                value={formData.point_depart} 
                onChange={e => setFormData({...formData, point_depart: e.target.value})} 
              />
              <Input 
                label="Point d'Arrivée" 
                placeholder="Ex: Aéroport" 
                icon="geo-fill" 
                required 
                value={formData.point_arrivee} 
                onChange={e => setFormData({...formData, point_arrivee: e.target.value})} 
              />
              <Input 
                label="Prix (CDF)" 
                type="number" 
                placeholder="Ex: 1000" 
                icon="currency-exchange" 
                required 
                value={formData.prix} 
                onChange={e => setFormData({...formData, prix: e.target.value})} 
              />
              <Input 
                label="Durée Estimée" 
                placeholder="Ex: 45 min" 
                icon="clock" 
                value={formData.duree_estimee} 
                onChange={e => setFormData({...formData, duree_estimee: e.target.value})} 
              />
              <div className="admin-select-group">
                <label>Statut</label>
                <select 
                  className="admin-select"
                  value={formData.statut} 
                  onChange={e => setFormData({...formData, statut: e.target.value})}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
            
            <div className="admin-form-actions">
              {editingTrajet && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setEditingTrajet(null); setFormData(initialFormState); }}
                  text="Annuler"
                  disabled={submitting}
                />
              )}
              <Button 
                type="submit" 
                variant="primary" 
                text={submitting ? "Traitement..." : (editingTrajet ? 'Enregistrer les modifications' : 'Créer le Trajet')}
                disabled={submitting}
              />
            </div>
          </form>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <Loading title="Chargement des trajets" description="Veuillez patienter..." />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Itinéraire</th>
                  <th>Prix</th>
                  <th>Durée</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trajets.length > 0 ? trajets.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <strong>{t.point_depart}</strong>
                        <i className="bi bi-arrow-right" style={{color: 'var(--text-muted)'}}></i>
                        <strong>{t.point_arrivee}</strong>
                      </div>
                    </td>
                    <td><span style={{color: 'var(--success-text)', fontWeight: '700'}}>{t.prix} CDF</span></td>
                    <td>{t.duree_estimee || 'N/A'}</td>
                    <td>
                      <span className={`badge ${t.statut === 'actif' ? 'badge-actif' : 'badge-hors_service'}`}>
                        {t.statut}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(t)}
                          text="Modifier"
                          style={{padding: '6px 12px', fontSize: '13px'}}
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleDelete(t.id)}
                          text="Supprimer"
                          style={{padding: '6px 12px', fontSize: '13px', color: 'var(--error-text)', borderColor: 'var(--error-bg)'}}
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                      Aucun trajet défini pour le moment.
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

export default AdminTrajets;
