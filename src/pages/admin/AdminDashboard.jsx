import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Loading from '../../components/ui/Loading';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trajets/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Couleurs pour le graphique
  const COLORS = ['#ffb800', '#e6a600', '#cc9400', '#b38200', '#996f00'];

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Tableau de Bord</h2>
        </div>
        
        <div className="admin-chart-section" style={{marginTop: 0}}>
          <div className="chart-card">
            <div className="chart-header">
              <h3>Fréquence des Trajets</h3>
              <p>Classement des trajets les plus fréquentés (basé sur les paiements réussis)</p>
            </div>
            
            <div className="chart-content">
              {loading ? (
                <div style={{height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Loading title="Chargement du graphique" description="Analyse des données en cours..." />
                </div>
              ) : stats.length > 0 ? (
                <div style={{ width: '100%', height: 450 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={stats}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="trajet_label" 
                        type="category" 
                        width={150} 
                        axisLine={false}
                        tickLine={false}
                        tick={{fill: 'var(--text-main)', fontSize: 13, fontWeight: 500}}
                      />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                          padding: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="total_paiements" 
                        name="Nombre de paiements" 
                        radius={[0, 4, 4, 0]}
                        barSize={35}
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'}}>
                  Aucune donnée disponible pour le graphique.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
