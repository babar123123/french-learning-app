import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Brain, Trophy, ArrowRight } from 'lucide-react';
import './Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isEntryLoaded, setIsEntryLoaded] = useState(false);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        setUser(savedUser);
        const timer = setTimeout(() => setIsEntryLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const steps = [
        {
            type: 'personalized',
            title: "Bienvenue",
            content: (name) => (
                <div className="step-content-inner">
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
                    <h2 className="display-name">{name || 'Explorer'}!</h2>
                    <p className="welcome-tagline">
                        The ultimate journey to mastering a new language. Learn through games, dialogues, and AI practice.
                    </p>
                </div>
            )
        },
        {
            type: 'info',
            title: "Real AI Conversations",
            desc: "Our AI Tutor listens and corrects you in real-time. It's like having a native teacher in your pocket.",
            icon: <Brain size={52} className="text-accent" />,
            color: "var(--accent)"
        },
        {
            type: 'info',
            title: "Track Your Progress",
            desc: "Earn XP, unlock 35+ levels, and collect rare badges as you move from Novice to Master.",
            icon: <Trophy size={52} className="text-success" />,
            color: "var(--success)"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            navigate('/');
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    return (
        <div className="onboarding-overlay welcome-screen">
            <div className={`onboarding-modal glass-panel ${isEntryLoaded ? 'animate-zoom-in' : ''}`}>
                <button className="skip-btn" onClick={handleSkip}>
                    Skip
                </button>

                <div className="slider-overflow">
                    <div
                        className="steps-slider"
                        style={{ transform: `translateX(-${currentStep * 100}%)` }}
                    >
                        {steps.map((step, idx) => (
                            <div className="step-slide" key={idx}>
                                {step.type === 'personalized' ? (
                                    step.content(user?.name)
                                ) : (
                                    <div className="step-content-inner">
                                        <div className="icon-box-large" style={{ background: `${step.color}15`, color: step.color }}>
                                            {step.icon}
                                        </div>
                                        <h2 className="step-title">{step.title}</h2>
                                        <p className="step-desc">{step.desc}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="onboarding-footer">
                    <div className="dots">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`dot ${i === currentStep ? 'active' : ''}`}
                                onClick={() => setCurrentStep(i)}
                            />
                        ))}
                    </div>

                    <button className="btn btn-primary welcome-next-btn premium-glow" onClick={handleNext}>
                        {currentStep === steps.length - 1 ? "Start Quest" : "Next"} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
