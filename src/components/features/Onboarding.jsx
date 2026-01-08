import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Trophy, ArrowRight, X } from 'lucide-react';
import './Onboarding.css';

const Onboarding = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const completed = localStorage.getItem('onboarding_complete');
        if (!completed) {
            setIsVisible(true);
        }
    }, []);

    const steps = [
        {
            title: "Welcome to Language Quest",
            desc: "The ultimate journey to mastering a new language. Learn through games, dialogues, and AI practice.",
            icon: <Sparkles size={48} className="text-primary" />,
            color: "var(--primary)"
        },
        {
            title: "Real AI Conversations",
            desc: "Our AI Tutor listens and corrects you in real-time. It's like having a native teacher in your pocket.",
            icon: <Brain size={48} className="text-accent" />,
            color: "var(--accent)"
        },
        {
            title: "Track Your Progress",
            desc: "Earn XP, unlock 35+ levels, and collect rare badges as you move from Novice to Master.",
            icon: <Trophy size={48} className="text-success" />,
            color: "var(--success)"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            finish();
        }
    };

    const finish = () => {
        localStorage.setItem('onboarding_complete', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-modal glass-panel animate-fade-in">
                <button className="skip-btn" onClick={finish}>Skip</button>

                <div className="step-content animate-slide-up" key={currentStep}>
                    <div className="icon-box" style={{ background: `${steps[currentStep].color}22` }}>
                        {steps[currentStep].icon}
                    </div>
                    <h2>{steps[currentStep].title}</h2>
                    <p>{steps[currentStep].desc}</p>
                </div>

                <div className="onboarding-footer">
                    <div className="dots">
                        {steps.map((_, i) => (
                            <div key={i} className={`dot ${i === currentStep ? 'active' : ''}`} />
                        ))}
                    </div>
                    <button className="btn btn-primary next-btn" onClick={handleNext}>
                        {currentStep === steps.length - 1 ? "Start Learning" : "Next"} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
