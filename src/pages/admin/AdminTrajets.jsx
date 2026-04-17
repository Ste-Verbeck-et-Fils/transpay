import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';

const AdminTrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrajet, setEditingTrajet] = useState(null);
  const [formData, setFormData] = useState({ point_depart: '', point_arrivee: '', prix: '', duree_estimee: '', statut: 'actif' });

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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trajet) => {
    setEditingTrajet(trajet.id);
    setFormData({ ...trajet });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce trajet ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/trajets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrajets();
    } catch (error) {
      console.error('Erreur delete', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingTrajet) {
        await axios.put(`http://localhost:5000/api/trajets/${editingTrajet}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/trajets', formData, config);
      }
      setEditingTrajet(null);
      setFormData({ point_depart: '', point_arrivee: '', prix: '', duree_estimee: '', statut: 'actif' });
      fetchTrajets();
    } catch (error) {
      console.error('Erreur submit', error);
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Gestion des Trajets</h2>
        </div>

        <div className="admin-form-container">
          <h3>{editingTrajet ? 'Modifier' : 'Ajouter'} un Trajet</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Point de départ</label>
              <input required value={formData.point_depart} onChange={e => setFormData({...formData, point_depart: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Point d'arrivée</label>
              <input required value={formData.point_arrivee} onChange={e => setFormData({...formData, point_arrivee: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Prix (CDF)</label>
              <input type="number" required value={formData.prix} onChange={e => setFormData({...formData, prix: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Durée estimée</label>
              <input value={formData.duree_estimee} onChange={e => setFormData({...formData, duree_estimee: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Statut</label>
              <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})}>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            <div className="admin-actions">
              <button type="submit" className="btn-save">{editingTrajet ? 'Enregistrer' : 'Créer'}</button>
              {editingTrajet && (
                <button type="button" className="btn-cancel" onClick={() => { setEditingTrajet(null); setFormData({ point_depart: '', point_arrivee: '', prix: '', duree_estimee: '', statut: 'actif' }); }}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {loading ? <p>Chargement...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Départ</th>
                <th>Arrivée</th>
                <th>Prix</th>
                <th>Durée</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.point_depart}</td>
                  <td>{t.point_arrivee}</td>
                  <td>{t.prix} CDF</td>
                  <td>{t.duree_estimee}</td>
                  <td>{t.statut}</td>
                  <td className="admin-actions">
                    <button className="btn-edit" onClick={() => handleEdit(t)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(t.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default AdminTrajets;
