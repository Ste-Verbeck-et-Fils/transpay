import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Loading from "../../components/ui/Loading";
import "../../styles/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/trajets/stats",
        );
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

  const PRIMARY_COLOR = "#ffb800";
  const PRIMARY_HOVER = "#e6a600";
  const COLORS = [PRIMARY_COLOR, "#FFC733", "#FFD666", "#FFE599", "#FFF4CC"];

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Tableau de Bord</h2>
        </div>

        <div className="admin-chart-section" style={{ marginTop: 0 }}>
          <div className="chart-card">
            <div className="chart-header">
              <h3>Fréquence des Trajets</h3>
              <p>Nombre de paiements réussis par itinéraire</p>
            </div>

            <div className="chart-content">
              {loading ? (
                <div
                  style={{
                    height: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Loading
                    title="Chargement du graphique"
                    description="Analyse des données en cours..."
                  />
                </div>
              ) : stats.length > 0 ? (
                <div style={{ width: "100%", height: 450 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={stats}
                      margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="trajet_label"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-60}
                        textAnchor="end"
                        tick={{
                          fill: "var(--text-main)",
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                        height={80}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          padding: "12px",
                        }}
                      />
                      <Bar
                        dataKey="total_paiements"
                        name="Paiements"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      >
                        {stats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? PRIMARY_COLOR
                                : COLORS[index % COLORS.length]
                            }
                            style={{ cursor: "pointer" }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div
                  style={{
                    height: "450px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                  }}
                >
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
