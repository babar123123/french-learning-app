import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, ArrowRight, MessageSquare, Languages, Trophy, Sparkles } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const googleButtonRef = useRef(null);
    const { playTap, playSuccess, playBlip } = useSound();
    const [googleReady, setGoogleReady] = useState(false);
    const [error, setError] = useState('');
    const hasRenderedGoogle = useRef(false);

    const GOOGLE_CLIENT_ID = "752757921858-gm78m69iikgvr82455gc6aprcqa8a199.apps.googleusercontent.com";

    useEffect(() => {
        let intervalId = null;

        const initGoogle = () => {
            if (window.google?.accounts?.id && !hasRenderedGoogle.current) {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }

                try {
                    // Forcefully disable auto-select twice to be sure
                    window.google.accounts.id.disableAutoSelect();

                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true
                    });

                    if (googleButtonRef.current && !hasRenderedGoogle.current) {
                        hasRenderedGoogle.current = true;
                        window.google.accounts.id.renderButton(
                            googleButtonRef.current,
                            {
                                theme: "filled_blue",
                                size: "large",
                                width: "250", // Fixed width for stability
                                text: "continue_with",
                                shape: "pill",
                                logo_alignment: "left"
                            }
                        );
                    }
                    setGoogleReady(true);
                } catch (err) {
                    console.error("Google Init Error:", err);
                }
            }
        };

        if (window.google?.accounts?.id) {
            initGoogle();
        } else {
            intervalId = setInterval(initGoogle, 200);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const handleGoogleResponse = (response) => {
        try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const user = JSON.parse(jsonPayload);

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify({
                name: user.name,
                email: user.email,
                picture: user.picture
            }));

            playSuccess();
            navigate('/welcome');
        } catch (err) {
            setError("Google Login failed. Please try again.");
        }
    };

    return (
        <div className="login-page ultra-premium-mockup">
            {/* Cinematic Background Layer with Ribbons and Bokeh */}
            <div className="ribbon-system">
                <div className="ribbon r1"></div>
                <div className="ribbon r2"></div>
                <div className="ribbon r3"></div>
                <div className="bokeh-layer">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={`bokeh b${i + 1}`}></div>
                    ))}
                </div>
            </div>

            <div className="mockup-card glass-panel animate-zoom-in">
                {/* Advanced Multi-Color Glowing Border */}
                <div className="neon-border-glow"></div>

                <div className="card-inner-content">
                    <div className="login-header-v3">
                        <div className="logo-gold-wrapper">
                            <Sparkles size={42} className="logo-icon-gold" />
                        </div>
                        <h1 className="logo-text-gold">Lumière</h1>
                    </div>

                    <div className="auth-zone-v3">
                        <div className="google-btn-container-gold">
                            <div className="google-btn-glow"></div>
                            <div ref={googleButtonRef} className="official-google-container"></div>
                        </div>
                        {!googleReady && <div className="loading-status-gold">Connecting to the future...</div>}
                    </div>

                    <div className="feature-showcase-v3">
                        <div className="feat-v3-item">
                            <div className="feat-v3-icon purple-gradient-icon">
                                <MessageSquare size={20} />
                            </div>
                            <span className="feat-v3-label">AI Tutor</span>
                        </div>
                        <div className="feat-v3-item">
                            <div className="feat-v3-icon pink-gradient-icon">
                                <ArrowRight size={20} />
                            </div>
                            <span className="feat-v3-label">Adaptive Learning</span>
                        </div>
                        <div className="feat-v3-item">
                            <div className="feat-v3-icon indigo-gradient-icon">
                                <Trophy size={20} />
                            </div>
                            <span className="feat-v3-label">Cultural Insights</span>
                        </div>
                    </div>
                </div>

                <div className="card-footer-v3">
                    <div className="secure-badge-v3">
                        <Lock size={12} />
                        <span>Encrypted Gateway</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
