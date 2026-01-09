import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, ArrowRight } from 'lucide-react';
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
            <div className="login-visual-bg">
                <div className="gradient-sphere"></div>
                <div className="gradient-sphere secondary"></div>
                <div className="floating-elements">
                    <div className="float-item p1">FR</div>
                    <div className="float-item p2">Bonjour</div>
                    <div className="float-item p3">AI</div>
                </div>
            </div>

            <div className="login-container glass-panel animate-fade-in">
                <div className="login-header">
                    <div className="login-logo-ring">
                        <Crown size={32} className="text-primary" />
                    </div>
                    <h1>Lumière</h1>
                    <p className="subtitle">Master French with AI Intelligence</p>
                </div>

                <div className="feature-preview">
                    <div className="feature-item">
                        <div className="feat-icon"><ArrowRight size={14} /></div>
                        <span>Interactive Conversations</span>
                    </div>
                    <div className="feature-item">
                        <div className="feat-icon"><ArrowRight size={14} /></div>
                        <span>Personalized Learning Path</span>
                    </div>
                    <div className="feature-item">
                        <div className="feat-icon"><ArrowRight size={14} /></div>
                        <span>Real-time Corrections</span>
                    </div>
                </div>

                {error && <div className="error-msg animate-shake">{error}</div>}

                <div className="cta-section">
                    <p className="cta-label">Ready to start your quest?</p>
                    <div className="social-login-vertical">
                        <div ref={googleButtonRef} className="official-google-container"></div>
                        {!googleReady && <div className="loading-spinner-simple">Connecting to secure gateway...</div>}
                    </div>
                </div>

                <div className="login-footer">
                    <div className="trust-badge">
                        <Lock size={12} />
                        <span>Verified by Google Identity</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
