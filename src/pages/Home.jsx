import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, Book, ArrowRight, Users, Zap, Globe, Info, X } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

import './CinematicHero.css';

const Home = () => {
    const { playTap, playSuccess, playBlip } = useSound();
    const { targetLanguage } = useLanguage();
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // Dynamic words for the cinematic background
    const floatingWords = {
        French: ['Lumière', 'Savoir', 'Rêve', 'Paris', 'Amour'],
        Spanish: ['Lenguaje', 'Explorar', 'Sueño', 'Madrid', 'Vida'],
        German: ['Wissen', 'Traum', 'Berlin', 'Licht', 'Zukunft']
    }[targetLanguage] || ['Explore', 'Learn', 'Master'];

    const content = {
        // ... (existing content logic)
        French: {
            title: "Master French",
            phrase: "Comment ça va ?",
            reply: "Je vais très bien, merci !",
            fact: "Did you know? French is the only language, alongside English, taught in every country in the world.",
            details: "French is a Romance language spoken by about 300 million people. It's the official language in 29 countries including France, Canada, Belgium, and Switzerland. It's known as the language of diplomacy, art, and love."
        },
        Spanish: {
            title: "Master Spanish",
            phrase: "¿Cómo estás?",
            reply: "¡Estoy muy bien, gracias!",
            fact: "Did you know? Spanish is the world's second-most spoken native language after Mandarin Chinese.",
            details: "Spanish is spoken by over 500 million people. It's the primary language in Spain and most of Latin America. It's a Phonetic language, meaning it's spoken exactly as it's written, making it one of the easiest languages to start learning!"
        },
        German: {
            title: "Master German",
            phrase: "Wie geht es dir?",
            reply: "Mir geht es sehr gut, danke!",
            fact: "Did you know? German words can be incredibly long. One of the longest: Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz!",
            details: "German is the most widely spoken native language in the European Union. It's famous for its logical (yet complex) grammar and its ability to create new words by compounding smaller ones. It's the language of philosophy, science, and innovation."
        }
    }[targetLanguage];

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name?.split(' ')[0] || 'Explorer';

    const greetings = {
        French: 'Bonjour',
        Spanish: '¡Hola',
        German: 'Hallo'
    };

    return (
        <div className="home-page">
            {/* Cinematic Video Hero */}
            <section className="cinematic-hero">
                <div className="video-container">
                    <video
                        className="video-bg"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1920"
                    >
                        <source src="https://player.vimeo.com/external/370331493.sd.mp4?s=7b0d4a9bac35c225a3962d8540c4900a6f44357c&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                    </video>
                    <div className="hero-overlay"></div>
                </div>

                <div className="floating-words">
                    {floatingWords.map((word, i) => (
                        <span
                            key={i}
                            className="word"
                            style={{
                                top: `${20 + (i * 15)}%`,
                                left: `${10 + (i * 20)}%`,
                                animationDelay: `${i * 2}s`
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </div>

                <div className="container cinematic-content animate-fade-in">
                    <h2 className="cinematic-subtitle">The Future of Language Learning</h2>
                    <h1 className="cinematic-title text-gradient">Lumière AI</h1>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        <button
                            className="btn btn-primary btn-glow"
                            onClick={() => {
                                playSuccess();
                                document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ padding: '16px 40px', fontSize: '1.2rem' }}
                        >
                            Start Your Journey <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <span>Scroll to Explore</span>
                    <div className="mouse"></div>
                </div>
            </section>

            {/* Hero Section */}
            <section className="hero" id="main-content">
                <div className="container hero-container">
                    <div className="hero-content animate-fade-in">
                        <div className="badge catch-phrase">✨ AI-Powered {targetLanguage} Tutor</div>
                        <h1 className="hero-title">
                            {greetings[targetLanguage] || 'Hello'}, {userName}! 👋 <br />
                            {content.title}
                        </h1>
                        <p className="hero-subtitle">
                            Immerse yourself in {targetLanguage} with Lumière.
                            Real-time corrections, cultural insights, and conversations that feel human in Roman Urdu & English.
                        </p>
                        <div className="hero-actions">
                            <Link to="/chat" className="btn btn-primary btn-glow" onClick={playSuccess}>
                                Start Learning <ArrowRight size={18} />
                            </Link>
                            <Link to="/level-path" className="btn btn-secondary glass" onClick={playTap}>
                                Learning Path ✨
                            </Link>
                            <Link to="/lessons" className="btn btn-secondary glass" onClick={playTap}>
                                Curriculum
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual animate-fade-in delay-200">
                        <div className="visual-card glass-panel floating">
                            <div className="chat-bubble user">
                                <span className="sc-text">{content.phrase}</span>
                            </div>
                            <div className="chat-bubble ai animate-slide-up">
                                <span className="sc-text">{content.reply}</span>
                                <span className="correction-indicator">✓ Perfect!</span>
                            </div>
                            <div className="orbit-decoration"></div>
                            <div className="floating-badge lang-badge">{targetLanguage}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats Section */}
            <section className="stats-bar container animate-fade-in delay-300">
                <div className="stat-item">
                    <Users size={20} className="text-primary" />
                    <span><strong>15k+</strong> Active Learners</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <Zap size={20} className="text-accent" />
                    <span><strong>98%</strong> Success Rate</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <Globe size={20} className="text-success" />
                    <span><strong>3</strong> Major Languages</span>
                </div>
            </section>

            {/* Info Section - Informative Part */}
            <section className="info-section container animate-fade-in delay-400">
                <div className="info-card glass-panel">
                    <div className="info-icon"><Info size={24} /></div>
                    <div className="info-text">
                        <h4>Informative Fact</h4>
                        <p>{content.fact}</p>
                    </div>
                    <button className="btn-icon-link" onClick={() => { playBlip(); setIsInfoModalOpen(true); }}>Read More</button>
                </div>
            </section>

            {/* Info Modal */}
            {isInfoModalOpen && (
                <div className="modal-overlay" onClick={() => setIsInfoModalOpen(false)}>
                    <div className="info-modal glass-panel animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => { playBlip(); setIsInfoModalOpen(false); }}><X size={24} /></button>
                        <div className="modal-icon-header">
                            <Sparkles size={40} className="text-accent" />
                        </div>
                        <h2>About {targetLanguage}</h2>
                        <div className="modal-body">
                            <p className="main-info">{content.details}</p>
                            <div className="fact-highlight">
                                💡 <strong>Key Fact:</strong> {content.fact}
                            </div>
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setIsInfoModalOpen(false)}>Understood!</button>
                    </div>
                </div>
            )}

            {/* Features Grid */}
            <section className="features container">
                <div className="feature-card glass-panel animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <div className="icon-wrapper i-blue"><MessageCircle size={32} /></div>
                    <h3>Natural Conversation</h3>
                    <p>Practice with an AI that understands Roman Urdu and provides explanations in your language.</p>
                </div>
                <div className="feature-card glass-panel animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <div className="icon-wrapper i-purple"><Sparkles size={32} /></div>
                    <h3>Instant Feedback</h3>
                    <p>Get corrections on grammar and pronunciation the moment you make a mistake.</p>
                </div>
                <div className="feature-card glass-panel animate-fade-in" style={{ animationDelay: '700ms' }}>
                    <div className="icon-wrapper i-gold"><Book size={32} /></div>
                    <h3>Gamified Learning</h3>
                    <p>Earn XP, win challenges, and track your levels as you progress to fluency.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
