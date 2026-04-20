import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Erreur fetch users', error);
      setFeedback({ type: "error", message: "Impossible de charger les utilisateurs." });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback({ type: "success", message: "Rôle mis à jour avec succès." });
      fetchUsers();
    } catch (error) {
      console.error('Erreur update role', error);
      setFeedback({ type: "error", message: "Erreur lors du changement de rôle." });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback({ type: "success", message: "Utilisateur supprimé." });
      fetchUsers();
    } catch (error) {
      console.error('Erreur delete user', error);
      setFeedback({ type: "error", message: "Erreur lors de la suppression." });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Gestion des Utilisateurs</h2>
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
            <Loading title="Chargement des utilisateurs" description="Accès aux comptes du système..." />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom Complet</th>
                  <th>Téléphone</th>
                  <th>Rôle Actuel</th>
                  <th>Date d'inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div style={{
                          width: '35px', 
                          height: '35px', 
                          borderRadius: '50%', 
                          background: 'var(--primary-color)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {user.nom_complet.charAt(0).toUpperCase()}
                        </div>
                        <strong>{user.nom_complet}</strong>
                      </div>
                    </td>
                    <td>{user.telephone}</td>
                    <td>
                      <select 
                        className="admin-select" 
                        value={user.role}
                        style={{width: '140px', padding: '6px 10px', fontSize: '13px'}}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                      >
                        <option value="passager">Passager</option>
                        <option value="controleur">Contrôleur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td style={{fontSize: '14px', color: 'var(--text-muted)'}}>
                      {formatDate(user.date_creation)}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Button
                          variant="outline"
                          onClick={() => handleDelete(user.id)}
                          text="Supprimer"
                          style={{padding: '6px 12px', fontSize: '12px', color: 'var(--error-text)', borderColor: 'var(--error-bg)'}}
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                      Aucun utilisateur trouvé.
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
