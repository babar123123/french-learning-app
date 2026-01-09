import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, ArrowRight, Mic, Brain, Globe } from 'lucide-react';
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
        <div className="login-page">
            {/* Cinematic Background Layer */}
            <div className="mesh-gradient-container">
                <div className="mesh-blob b1"></div>
                <div className="mesh-blob b2"></div>
                <div className="mesh-blob b3"></div>
            </div>

            <div className="magic-particles">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`magic-particle p${i + 1}`}></div>
                ))}
            </div>

            <div className="login-container magic-card animate-fade-in">
                {/* Shiny Sweep Overlay */}
                <div className="card-shine"></div>

                <div className="login-header">
                    <div className="logo-section">
                        <div className="login-logo-ring">
                            <Crown size={34} className="crown-inner" />
                        </div>
                        <h1 className="brand-name">Lumière</h1>
                        <div className="brand-tagline">L'intelligence Artificielle au service de votre français</div>
                    </div>
                </div>

                <div className="feature-showcase-v4">
                    <div className="feat-v4-item">
                        <div className="feat-v4-icon-glow">
                            <Mic size={28} />
                        </div>
                        <span className="feat-v4-label">AI Tutor</span>
                    </div>
                    <div className="feat-v4-item">
                        <div className="feat-v4-icon-glow">
                            <Brain size={28} />
                        </div>
                        <span className="feat-v4-label">Adaptive Learning</span>
                    </div>
                    <div className="feat-v4-item">
                        <div className="feat-v4-icon-glow">
                            <Globe size={28} />
                        </div>
                        <span className="feat-v4-label">Cultural Insights</span>
                    </div>
                </div>

                {error && <div className="error-msg animate-shake">{error}</div>}

                <div className="auth-zone">
                    <div className="cta-wrapper">
                        <p className="cta-sub">Begin your linguistic adventure</p>
                        <div className="social-login-vertical">
                            <div ref={googleButtonRef} className="official-google-container"></div>
                            {!googleReady && <div className="loading-spinner-premium">Initializing Secure Link...</div>}
                        </div>
                    </div>
                </div>

                <div className="login-footer">
                    <div className="security-seal">
                        <Lock size={12} />
                        <span>Encrypted & Verified Access</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
