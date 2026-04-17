import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';

const AdminBus = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({ numero_enregistrement: '', qr_code: '', capacite: '', type_bus: 'Minibus Hiace', nom_proprietaire: '', statut: 'actif' });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bus', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBuses(response.data.data);
      }
    } catch (error) {
      console.error('Erreur fetch bus', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus.id);
    setFormData({ ...bus });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce bus ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bus/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBuses();
    } catch (error) {
      console.error('Erreur delete', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingBus) {
        await axios.put(`http://localhost:5000/api/bus/${editingBus}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/bus', formData, config);
      }
      setEditingBus(null);
      setFormData({ numero_enregistrement: '', qr_code: '', capacite: '', type_bus: 'Minibus Hiace', nom_proprietaire: '', statut: 'actif' });
      fetchBuses();
    } catch (error) {
      console.error('Erreur submit', error);
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Gestion des Bus</h2>
        </div>

        <div className="admin-form-container">
          <h3>{editingBus ? 'Modifier' : 'Ajouter'} un Bus</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Numéro Enregistrement</label>
              <input required value={formData.numero_enregistrement} onChange={e => setFormData({...formData, numero_enregistrement: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>QR Code</label>
              <input required value={formData.qr_code} onChange={e => setFormData({...formData, qr_code: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Capacité</label>
              <input type="number" required value={formData.capacite} onChange={e => setFormData({...formData, capacite: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Type de bus</label>
              <input required value={formData.type_bus} onChange={e => setFormData({...formData, type_bus: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Propriétaire</label>
              <input required value={formData.nom_proprietaire} onChange={e => setFormData({...formData, nom_proprietaire: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Statut</label>
              <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})}>
                <option value="actif">Actif</option>
                <option value="hors_service">Hors service</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="admin-actions">
              <button type="submit" className="btn-save">{editingBus ? 'Enregistrer' : 'Créer'}</button>
              {editingBus && (
                <button type="button" className="btn-cancel" onClick={() => { setEditingBus(null); setFormData({ numero_enregistrement: '', qr_code: '', capacite: '', type_bus: 'Minibus Hiace', nom_proprietaire: '', statut: 'actif' }); }}>
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
                <th>N° Enregistrement</th>
                <th>QR</th>
                <th>Capacité</th>
                <th>Type</th>
                <th>Propriétaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.numero_enregistrement}</td>
                  <td>{b.qr_code}</td>
                  <td>{b.capacite}</td>
                  <td>{b.type_bus}</td>
                  <td>{b.nom_proprietaire}</td>
                  <td>{b.statut}</td>
                  <td className="admin-actions">
                    <button className="btn-edit" onClick={() => handleEdit(b)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(b.id)}>Supprimer</button>
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
export default AdminBus;
