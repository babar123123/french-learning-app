import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, Book, ArrowRight } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import './Home.css';

const Home = () => {
    const { playTap, playSuccess } = useSound();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content animate-fade-in">
                        <div className="badge catch-phrase">AI-Powered Fluency</div>
                        <h1 className="hero-title">
                            Master French <br />
                            <span className="text-gradient">With Intelligence</span>
                        </h1>
                        <p className="hero-subtitle">
                            Immerse yourself in a new language with Lumière.
                            Real-time corrections, cultural insights, and conversations that feel human.
                        </p>
                        <div className="hero-actions">
                            <Link to="/chat" className="btn btn-primary" onClick={playSuccess}>
                                Start Chatting <ArrowRight size={18} />
                            </Link>
                            <Link to="/lessons" className="btn btn-secondary" onClick={playTap}>
                                View Lessons
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual animate-fade-in delay-200">
                        {/* Abstract visual representation of AI/Chat */}
                        <div className="visual-card glass-panel">
                            <div className="chat-bubble user">
                                <span className="sc-text">Comment ça va ?</span>
                            </div>
                            <div className="chat-bubble ai">
                                <span className="sc-text">Je vais très bien, merci ! Et vous ?</span>
                                <span className="correction-indicator">Perfect usage!</span>
                            </div>
                            <div className="orbit-decoration"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features container">
                <div className="feature-card glass-panel animate-fade-in delay-300">
                    <div className="icon-wrapper"><MessageCircle size={32} /></div>
                    <h3>Natural Conversation</h3>
                    <p>Practice with an AI that understands context, slang, and formal nuances.</p>
                </div>
                <div className="feature-card glass-panel animate-fade-in delay-300">
                    <div className="icon-wrapper"><Sparkles size={32} /></div>
                    <h3>Instant Feedback</h3>
                    <p>Get corrections on grammar and pronunciation the moment you make a mistake.</p>
                </div>
                <div className="feature-card glass-panel animate-fade-in delay-300">
                    <div className="icon-wrapper"><Book size={32} /></div>
                    <h3>Structured Path</h3>
                    <p>Follow a curvature designed to take you from beginner to fluent.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
