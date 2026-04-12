import React, { useState } from 'react';
import './Header.css';
import Button from '../ui/Button';

const Header = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = ['Home', 'Trips', 'History', 'Profile'];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-logo">
          TransPay
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {navLinks.map((link) => (
            <div 
              key={link} 
              className={`nav-link-wrapper ${activeLink === link ? 'active' : ''}`}
              onClick={() => setActiveLink(link)}
            >
              <a href={`#${link.toLowerCase()}`} className="nav-link">
                {link}
              </a>
              {activeLink === link && <div className="nav-indicator"></div>}
            </div>
          ))}
        </nav>

        <div className="header-actions">
          <Button text="Se connecter" variant="primary" className="header-btn" />
          
          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <i className={`bi bi-${isMenuOpen ? 'x' : 'list'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}></div>
      )}
      
      <nav className={`mobile-nav-drawer ${isMenuOpen ? 'open' : ''}`}>
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
              className={`mobile-nav-link ${activeLink === link ? 'active' : ''}`}
              onClick={() => {
                setActiveLink(link);
                setIsMenuOpen(false);
              }}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="mobile-nav-footer">
          <Button text="Se connecter" variant="primary" className="mobile-login-btn" />
        </div>
      </nav>
    </header>
  );
};


export default Header;
