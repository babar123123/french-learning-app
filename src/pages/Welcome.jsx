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

        // Short delay for animation entry
        const timer = setTimeout(() => setShowContent(true), 100);

        // Auto redirect after 5 seconds if user doesn't click
        const redirectTimer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    const handleContinue = () => {
        navigate('/');
    };

    return (
        <div className="welcome-splash">
            <div className="login-visual-bg">
                <div className="gradient-sphere"></div>
                <div className="gradient-sphere secondary"></div>
            </div>

            <div className={`welcome-card glass-panel ${showContent ? 'animate-zoom-in' : ''}`}>
                <div className="welcome-icon-container">
                    <div className="bot-avatar animate-float">
                        <Bot size={50} color="white" />
                        <div className="sparkle-effect">
                            <Sparkles size={20} className="sparkle-1" />
                            <Sparkles size={20} className="sparkle-2" />
                        </div>
                    </div>
                </div>

                <div className="welcome-text">
                    <h1 className="text-gradient">Bienvenue, {user?.name || 'Explorer'}!</h1>
                    <p className="subtitle">Lumière is excited to guide you on your French quest.</p>

                    <div className="welcome-quote">
                        <p>"Ready to turn your curiosity into conversation?"</p>
                    </div>
                </div>

                <button className="btn btn-primary welcome-btn" onClick={handleContinue}>
                    Enter Quest <ArrowRight size={20} />
                </button>

                <p className="auto-redirect-note">Redirecting to front page in a few seconds...</p>
            </div>
        </div>
    );
};

export default Welcome;
