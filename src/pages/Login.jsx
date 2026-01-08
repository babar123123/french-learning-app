import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const googleButtonRef = useRef(null);
    const { playTap, playSuccess, playBlip } = useSound();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const GOOGLE_CLIENT_ID = "752757921858-gm78m69iikgvr82455gc6aprcqa8a199.apps.googleusercontent.com";

    useEffect(() => {
        const initGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleResponse
                });

                // Render the official Google button (Highly Reliable)
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    {
                        theme: "filled_blue",
                        size: "large",
                        width: "200",
                        text: "continue_with",
                        shape: "pill"
                    }
                );
            }
        };

        // Retry if script loading is slow
        const checkInterval = setInterval(() => {
            if (window.google) {
                initGoogle();
                clearInterval(checkInterval);
            }
        }, 500);

        return () => clearInterval(checkInterval);
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
            window.location.href = '#/welcome'; // Hash router fix
            window.location.reload();
        } catch (err) {
            setError("Google Login failed. Please try again.");
        }
    };

    const handleSwitch = () => {
        playBlip();
        setIsLogin(!isLogin);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        playTap();

        if (isLogin) {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser && savedUser.email === formData.email && savedUser.password === formData.password) {
                localStorage.setItem('isAuthenticated', 'true');
                playSuccess();
                navigate('/welcome');
            } else {
                setError('Invalid email or password');
            }
        } else {
            if (!formData.name || !formData.email || !formData.password) {
                setError('Please fill all fields');
                return;
            }
            localStorage.setItem('user', JSON.stringify(formData));
            localStorage.setItem('isAuthenticated', 'true');
            playSuccess();
            navigate('/welcome');
        }
    };

    return (
        <div className="login-page">
            <div className="login-visual-bg">
                <div className="gradient-sphere"></div>
                <div className="gradient-sphere secondary"></div>
            </div>

            <div className="login-container glass-panel animate-zoom-in">
                <div className="login-header">
                    <div className="login-logo">
                        <Crown size={40} className="text-primary" />
                        <span className="logo-text">Lumière</span>
                    </div>
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{isLogin ? 'Continue your language quest today.' : 'Join thousands of explorers.'}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-msg animate-shake">{error}</div>}

                    {!isLogin && (
                        <div className="input-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-glow login-submit">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className="login-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login-vertical">
                    {/* The OFFICIAL Google Button Container */}
                    <div ref={googleButtonRef} className="official-google-container"></div>


                </div>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className="switch-btn" onClick={handleSwitch}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
