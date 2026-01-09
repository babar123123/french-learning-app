import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';
import './Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        setUser(savedUser);

        // Animation trigger
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        navigate('/');
    };

    return (
        <div className="welcome-splash">
            {/* Premium Animated Background */}
            <div className="login-visual-bg">
                <div className="gradient-sphere"></div>
                <div className="gradient-sphere secondary"></div>
            </div>

            <div className={`welcome-card-premium glass-panel ${showContent ? 'animate-zoom-in' : ''}`}>
                <div className="welcome-header">
                    <h1 className="text-gradient">Bienvenue</h1>

                    <div className="bot-avatar-container">
                        <div className="bot-avatar animate-float">
                            <Bot size={60} color="white" />
                            <div className="sparkle-effect">
                                <Sparkles size={24} className="sparkle-1" />
                                <Sparkles size={24} className="sparkle-2" />
                            </div>
                        </div>
                    </div>

                    <h2 className="user-name-display">{user?.name || 'Explorer'}!</h2>
                </div>

                <div className="welcome-body">
                    <p className="subtitle">Lumière is excited to guide you on your French quest. Ready to turn your curiosity into conversation?</p>

                    <div className="welcome-quote">
                        <p>"Your journey to fluency starts here."</p>
                    </div>
                </div>

                <div className="welcome-footer-actions">
                    <button className="btn btn-primary next-btn premium-next" onClick={handleContinue}>
                        Enter Quest <ArrowRight size={20} />
                    </button>
                    <p className="tap-hint">Tap to start learning</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
