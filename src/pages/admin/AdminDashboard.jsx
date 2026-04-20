import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Loading from '../../components/ui/Loading';
import '../../styles/admin.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
        console.error("Erreur stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const data = {
    labels: stats.map(s => s.trajet_label),
    datasets: [
      {
        label: 'Paiements',
        data: stats.map(s => s.total_paiements),
        backgroundColor: '#ffb800',
        borderColor: '#e6a600',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: '#e6a600',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: '500'
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#9ca3af',
          stepSize: 1
        }
      },
    },
  };

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
              <p>Classement des trajets les plus fréquentés</p>
            </div>
            
            <div className="chart-content" style={{height: '400px', position: 'relative'}}>
              {loading ? (
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Loading title="Chargement du graphique" description="Analyse des données..." />
                </div>
              ) : stats.length > 0 ? (
                <Bar data={data} options={options} />
              ) : (
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280'}}>
                  Aucune donnée disponible.
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
