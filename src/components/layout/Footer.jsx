import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-left">
          <h3 className="footer-logo">TRANSPAY</h3>
          <p className="footer-copyright">
            © {currentYear} TransPay. Kinetic Precision for Goma.
          </p>
        </div>

        <nav className="footer-links">
          <a href="#privacy" className="footer-link">PRIVACY POLICY</a>
          <a href="#terms" className="footer-link">TERMS OF SERVICE</a>
          <a href="#help" className="footer-link">HELP CENTER</a>
          <a href="#contact" className="footer-link">CONTACT</a>
        </nav>

        <div className="footer-icons">
          <div className="footer-icon-circle">
            <i className="bi bi-globe"></i>
          </div>
          <div className="footer-icon-circle">
            <i className="bi bi-browser-safari"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
