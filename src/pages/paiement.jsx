import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/busDetails.css";
import taxiChauffeurImg from "../assets/images/taxichauffeur.png";

const Paiement = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bus, trajet } = location.state || {};

    // Fallback data if page is accessed directly
    const displayTrajet = trajet || {
        point_depart: "Rond-Point BDGL",
        point_arrivee: "Birere, Goma",
        prix: 500
    };

    const displayBus = bus || {
        type_bus: "Minibus Hiace",
        nom_chauffeur: "JEAN-MARC VERBECK",
        numero_enregistrement: "TP-8842"
    };

    const handlePayment = () => {
        // Here you would normally call the Mobile Money API
        alert("Paiement initié ! Vous allez recevoir une demande de confirmation sur votre téléphone.");
        // Mock success navigation
        setTimeout(() => {
            navigate("/ticket", { state: { bus: displayBus, trajet: displayTrajet } });
        }, 2000);
    };

    return (
        <div className="details-page">
            <Header />

            <main className="details-main">
                <div className="map-bg"></div>
                
                <div className="details-content">
                    <section className="trajet-summary-card">
                        <div className="summary-left">
                            <span className="label">TRAJET SÉLECTIONNÉ</span>
                            <h2>{displayTrajet.point_depart} → {displayTrajet.point_arrivee.split(',')[0]}</h2>
                        </div>
                        <div className="price-badge">
                            <span className="amount">{Math.floor(displayTrajet.prix)}</span>
                            <span className="unit">CDF</span>
                        </div>
                    </section>

                    <section className="info-cards-group">
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="dot active"></div>
                                <div className="connector"></div>
                                <div className="timeline-text">
                                    <span className="label">DÉPART</span>
                                    <span className="value">{displayTrajet.point_depart}</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="dot"></div>
                                <div className="timeline-text">
                                    <span className="label">DESTINATION</span>
                                    <span className="value">{displayTrajet.point_arrivee}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-divider"></div>

                        <div className="metrics-row">
                            <div className="metric-card">
                                <div className="metric-icon">
                                    <i className="bi bi-clock"></i>
                                </div>
                                <div className="metric-info">
                                    <span className="m-label">TEMPS</span>
                                    <span className="m-value">{displayTrajet.duree_estimee || "12-15 min"}</span>
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-icon">
                                    <i className="bi bi-bus-front"></i>
                                </div>
                                <div className="metric-info">
                                    <span className="m-label">TYPE</span>
                                    <span className="m-value">{displayBus.type_bus}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="chauffeur-card">
                        <div className="driver-info">
                            <div className="driver-avatar-wrapper">
                                <img src={taxiChauffeurImg} alt="Driver" className="driver-avatar" />
                                <div className="verified-icon">
                                    <i className="bi bi-check"></i>
                                </div>
                            </div>
                            <div className="driver-name-box">
                                <span className="d-label">CONDUCTEUR</span>
                                <h3>{displayBus.nom_chauffeur}</h3>
                            </div>
                        </div>
                        <div className="rating-box">
                            <i className="bi bi-star-fill"></i>
                            <span>4.9</span>
                        </div>
                    </section>

                    <button className="btn-pay" onClick={handlePayment}>
                        Payer avec Mobile Money
                    </button>

                    <p className="footer-disclaimer">
                        Le paiement sera débité de votre compte mobile money configuré.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Paiement;
