import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BookOpen, Crown, Menu, X, Volume2, VolumeX, Languages, ChevronRight } from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import { useLanguage } from '../../context/LanguageContext';
import './Layout.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isMuted, toggleMute, playBlip, playTap, playSuccess } = useSound();
  const { targetLanguage, setTargetLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLangOpen && !event.target.closest('.language-selector-wrapper')) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Curriculum', path: '/lessons', icon: <BookOpen size={18} /> },
    { name: 'AI Tutor', path: '/chat', icon: <MessageSquare size={18} /> },
  ];

  const languages = ['French', 'Spanish', 'German'];

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

          <div className={`language-selector-wrapper ${isLangOpen ? 'open' : ''}`} onClick={() => setIsLangOpen(!isLangOpen)}>
            <Languages size={18} className="lang-icon" />
            <span className="current-lang">{targetLanguage}</span>
            <ChevronRight size={14} className={`chevron-icon ${isLangOpen ? 'rotate' : ''}`} />

            {isLangOpen && (
              <div className="lang-dropdown glass-panel">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className={`lang-option ${targetLanguage === lang ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTargetLanguage(lang);
                      playBlip();
                      setIsLangOpen(false);
                    }}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>

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

            <div className="mobile-lang-section">
              <p className="mobile-section-label">Target Language</p>
              <div className={`language-selector-wrapper ${isLangOpen ? 'open' : ''}`} onClick={() => setIsLangOpen(!isLangOpen)}>
                <Languages size={18} className="lang-icon" />
                <span className="current-lang">{targetLanguage}</span>
                <ChevronRight size={14} className={`chevron-icon ${isLangOpen ? 'rotate' : ''}`} />

                {isLangOpen && (
                  <div className="lang-dropdown glass-panel">
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className={`lang-option ${targetLanguage === lang ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetLanguage(lang);
                          playBlip();
                          setIsLangOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
