import React, { useState, useEffect } from "react";
import "./Header.css";
import Button from "../ui/Button";
import { useNavigate, useLocation, Link } from "react-router";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Trajet", path: "/trajet" },
    { name: "Historique", path: "/historique" },
    { name: "Profile", path: "/profile" },
    { name:"Paiement",path:"/paiement"},
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-logo" onClick={() => navigate("/")}>
          TransPay
        </div>

        <nav className="header-nav">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className={`nav-link-wrapper ${isActive(link.path) ? "active" : ""}`}
            >
              <Link to={link.path} className="nav-link">
                {link.name}
              </Link>
              {isActive(link.path) && <div className="nav-indicator"></div>}
            </div>
          ))}
        </nav>

        <div className="header-actions">
          <Button
            text={isLoggedIn ? "Se déconnecter" : "Se connecter"}
            variant="primary"
            className="header-btn"
            onClick={handleAuthAction}
          />

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <i className={`bi bi-${isMenuOpen ? "x" : "list"}`}></i>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}></div>
      )}

      <nav className={`mobile-nav-drawer ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <div className="header-logo" onClick={() => navigate("/")}>
            TransPay
          </div>
          <button className="close-menu-btn" onClick={toggleMenu}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="mobile-links-container">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="mobile-nav-footer">
          <Button
            text="S'inscrire"
            variant="outline"
            className="mobile-login-btn"
            onClick={() => navigate("/register")}
          />
          <br />
          <br />
          <Button
            text={isLoggedIn ? "Se déconnecter" : "Se connecter"}
            variant="primary"
            className="mobile-login-btn"
            onClick={handleAuthAction}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
