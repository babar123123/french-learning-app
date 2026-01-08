import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BookOpen, Crown, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import './Layout.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isMuted, toggleMute, playBlip, playTap, playSuccess } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Curriculum', path: '/lessons', icon: <BookOpen size={18} /> },
    { name: 'AI Tutor', path: '/chat', icon: <MessageSquare size={18} /> },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="logo" onClick={playBlip}>
          <Crown size={28} className="logo-icon" />
          <span className="logo-text">Lumière</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={playTap}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          <button
            className="sound-toggle-btn"
            onClick={() => { toggleMute(); playBlip(); }}
            title={isMuted ? "Play Music" : "Mute Music"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button className="btn btn-primary ml-4" onClick={playSuccess}>Join Community</button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="mobile-nav glass-panel">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
