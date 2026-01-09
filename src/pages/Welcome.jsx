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

        // Animation entry
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        navigate('/');
    };

    return (
        <div className="onboarding-overlay welcome-screen">
            <div className={`onboarding-modal glass-panel ${showContent ? 'animate-fade-in' : ''}`}>
                {/* Skip button from Image 1 */}
                <button className="skip-btn" onClick={handleContinue}>
                    Skip
                </button>

                <div className="step-content">
                    {/* Personalized Info from Image 2 */}
                    <h1 className="bienvenue-text text-gradient">Bienvenue</h1>

                    <div className="bot-avatar-wrapper">
                        <div className="bot-circle animate-float">
                            <Bot size={55} color="white" />
                            <div className="sparkle-overlay">
                                <Sparkles size={24} className="sparkle-top-right" />
                                <Sparkles size={24} className="sparkle-bottom-left" />
                            </div>
                        </div>
                    </div>

                    <h2 className="display-name">{user?.name || 'Explorer'}!</h2>
                </div>

                <div className="onboarding-footer">
                    {/* Progress dots from Image 1 */}
                    <div className="dots">
                        <div className="dot active"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    {/* Next button from Image 1 */}
                    <button className="btn btn-primary welcome-next-btn" onClick={handleContinue}>
                        Next <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
