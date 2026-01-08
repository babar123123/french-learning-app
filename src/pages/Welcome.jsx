import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, X } from 'lucide-react';
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

        // Auto-redirect is disabled per previous request to keep it stable
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleContinue = () => {
        navigate('/');
    };

    return (
        <div className="onboarding-overlay welcome-screen">
            <div className={`onboarding-modal glass-panel ${showContent ? 'animate-fade-in' : ''}`}>
                {/* Skip button top right like in the image */}
                <button className="skip-btn" onClick={handleContinue}>
                    Skip
                </button>

                <div className="step-content">
                    {/* Centered Sparkle Icon */}
                    <div className="icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                        <Sparkles size={48} color="white" />
                    </div>

                    {/* Personalized Title */}
                    <h2>Bienvenue, {user?.name || 'Explorer'}!</h2>

                    {/* App Description */}
                    <p>Lumière is excited to guide you on your French quest. Ready to turn your curiosity into conversation?</p>
                </div>

                <div className="onboarding-footer">
                    {/* Step dots like in the image */}
                    <div className="dots">
                        <div className="dot active"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    {/* Next button with arrow like in the image */}
                    <button className="btn btn-primary next-btn welcome-next-btn" onClick={handleContinue}>
                        Next <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
