import React, { useState } from "react";
import "./Header.css";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = ["Home", "Trajet", "Historique", "Profile"];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-logo">TransPay</div>

        <nav className="header-nav">
          {navLinks.map((link) => (
            <div
              key={link}
              className={`nav-link-wrapper ${activeLink === link ? "active" : ""}`}
              onClick={() => {
                setActiveLink(link);
                navigate(`/${link.toLowerCase()}`);
              }}
            >
              <a href={`/${link.toLowerCase()}`} className="nav-link">
                {link}
              </a>
              {activeLink === link && <div className="nav-indicator"></div>}
            </div>
          ))}
        </nav>

        <div className="header-actions">
          <Button
            text="Se connecter"
            variant="primary"
            className="header-btn"
            onClick={() => navigate("/login")}
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
          <div className="header-logo">TransPay</div>
          <button className="close-menu-btn" onClick={toggleMenu}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="mobile-links-container">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`mobile-nav-link ${activeLink === link ? "active" : ""}`}
              onClick={() => {
                setActiveLink(link);
                setIsMenuOpen(false);
                navigate(`/${link.toLowerCase()}`);
              }}
            >
              {link}
            </a>
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
            text="Se connecter"
            variant="primary"
            className="mobile-login-btn"
            onClick={() => navigate("/login")}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
