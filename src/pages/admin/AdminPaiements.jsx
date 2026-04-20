import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/admin.css';
import Loading from "../../components/ui/Loading";
import Feedback from "../../components/ui/Feedback";

const AdminPaiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/paiements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPaiements(response.data.data);
      }
    } catch (error) {
      console.error('Erreur fetch paiements', error);
      setFeedback({ type: "error", message: "Impossible de récupérer l'historique des paiements." });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Historique des Paiements</h2>
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
            <Loading title="Chargement des transactions" description="Récupération des données financières..." />
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
                {paiements.length > 0 ? paiements.map(p => (
                  <tr key={p.paiement_id}>
                    <td>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <strong>{p.utilisateur_nom}</strong>
                        <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>{p.utilisateur_telephone}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span>{p.point_depart} → {p.point_arrivee}</span>
                        <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>Bus: {p.numero_enregistrement}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{fontWeight: '700', color: 'var(--success-text)'}}>{p.montant} CDF</span>
                    </td>
                    <td>
                      <code style={{fontSize: '13px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px'}}>
                        {p.reference_transaction}
                      </code>
                    </td>
                    <td style={{fontSize: '14px'}}>
                      {formatDate(p.date_paiement)}
                    </td>
                    <td>
                      <span className={`badge badge-${p.statut === 'reussi' ? 'actif' : 'hors_service'}`}>
                        {p.statut}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                      Aucune transaction trouvée.
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

export default AdminPaiements;
