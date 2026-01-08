import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessonsData } from '../data/lessons';
import { useSound } from '../context/SoundContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, Star, Check, Trophy, Play, Zap, X, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import './LevelPath.css';

const LevelPath = () => {
    const navigate = useNavigate();
    const { targetLanguage } = useLanguage();
    const { playTap, playSuccess, playBlip } = useSound();

    const [unlockedLevel, setUnlockedLevel] = useState(1);
    const [userXP, setUserXP] = useState(0);
    const [streak, setStreak] = useState(1);
    const [celebratedBadge, setCelebratedBadge] = useState(null);

    const levels = lessonsData.map((lesson, index) => ({
        ...lesson,
        levelNumber: index + 1
    }));

    const badges = [
        { id: 'beg', title: 'Novice', icon: '🌱', minLevel: 1, desc: 'Started the journey' },
        { id: 'int', title: 'Traveler', icon: '✈️', minLevel: 11, desc: 'Can handle conversations' },
        { id: 'exp', title: 'Expert', icon: '🎓', minLevel: 24, desc: 'Fluent in French' },
        { id: 'mast', title: 'Master', icon: '👑', minLevel: 35, desc: 'Completed the Quest' },
    ];

    useEffect(() => {
        const savedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');
        const savedStreak = localStorage.getItem('streak');

        setUnlockedLevel(savedLevel);
        setUserXP(savedLevel * 50);
        if (savedStreak) setStreak(parseInt(savedStreak));

        // Celebration Logic
        const lastCelebrated = parseInt(localStorage.getItem('lastCelebratedBadge') || '0');
        const newBadge = [...badges].reverse().find(b => savedLevel >= b.minLevel && b.minLevel > lastCelebrated);

        if (newBadge) {
            setCelebratedBadge(newBadge);
            localStorage.setItem('lastCelebratedBadge', newBadge.minLevel.toString());

            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#ec4899', '#10b981']
                });
            }, 500);
        }
    }, [unlockedLevel]);

    const handleLevelClick = (level) => {
        if (level.levelNumber <= unlockedLevel) {
            playSuccess();
            navigate('/lessons', {
                state: {
                    openLessonId: level.id,
                    levelNumber: level.levelNumber,
                    from: 'level-path'
                }
            });
        } else {
            playBlip();
        }
    };

    return (
        <div className="level-path-container container">
            {celebratedBadge && (
                <div className="celebration-overlay">
                    <div className="celebration-modal glass-panel animate-fade-in">
                        <div className="badge-ring">
                            <span className="big-icon">{celebratedBadge.icon}</span>
                        </div>
                        <h2 className="celebration-title">New Badge Unlocked!</h2>
                        <h3 className="text-gradient badge-name">{celebratedBadge.title}</h3>
                        <p className="badge-desc">{celebratedBadge.desc}</p>
                        <button className="btn btn-primary continue-btn" onClick={() => setCelebratedBadge(null)}>
                            Keep Going!
                        </button>
                    </div>
                </div>
            )}

            <header className="path-header animate-fade-in">
                <div className="header-top">
                    <h1 className="text-gradient">Language Quest</h1>
                    <div className="header-actions">
                        <button className="pill-btn glass" onClick={() => navigate('/grammar')}>
                            <BookOpen size={16} /> Grammar
                        </button>
                        <div className="streak-pill glass">🔥 {streak} Day Streak</div>
                    </div>
                </div>

                <div className="stats-pills">
                    <div className="pill glass"><Star size={18} fill="var(--accent)" /> {userXP} XP</div>
                    <div className="pill glass"><Trophy size={18} fill="var(--primary)" /> Level {unlockedLevel}</div>
                    <div className="pill glass"><Zap size={18} fill="var(--success)" /> Rank: Pro</div>
                </div>

                <div className="achievements-row">
                    {badges.map(badge => (
                        <div key={badge.id} className={`badge-item ${unlockedLevel >= badge.minLevel ? 'unlocked' : 'locked'}`}>
                            <div className="badge-icon">{badge.icon}</div>
                            <div className="badge-info">
                                <h5>{badge.title}</h5>
                                <span>{badge.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </header>

            <div className="roadmap-path">
                {levels.map((level, index) => {
                    const isUnlocked = level.levelNumber <= unlockedLevel;
                    const isCompleted = level.levelNumber < unlockedLevel;
                    const isNext = level.levelNumber === unlockedLevel;
                    const xOffset = Math.sin(index * 1.5) * 50;

                    // Support localized title
                    const langKey = targetLanguage.toLowerCase() + 'Title';
                    const displayTitle = level[langKey] || level.title;

                    return (
                        <div key={level.id} className="path-node-wrapper" style={{ '--x-offset': `${xOffset}px` }}>
                            <div
                                className={`level-node ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                                onClick={() => handleLevelClick(level)}
                            >
                                <div className="node-inner">
                                    {isCompleted ? <Check size={32} /> : (isUnlocked ? level.levelNumber : <Lock size={24} />)}
                                </div>
                                <div className="node-tooltip">
                                    <h4>Level {level.levelNumber}: {displayTitle}</h4>
                                    <p>{isUnlocked ? 'Click to Start' : 'Locked'}</p>
                                </div>
                                {isNext && <div className="pulse-ring"></div>}
                            </div>
                            {index < levels.length - 1 && (
                                <div className="node-connector">
                                    <div className="connector-fill" style={{ height: isCompleted ? '100%' : '0%' }}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="path-footer-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/chat')}>Talk to AI Tutor</button>
                <button
                    className="btn-reset-progress"
                    onClick={() => {
                        if (window.confirm('Reset all progress?')) {
                            localStorage.setItem('unlockedLevel', '1');
                            localStorage.setItem('lastCelebratedBadge', '0');
                            window.location.reload();
                        }
                    }}
                    style={{ opacity: 0.5, fontSize: '12px', marginTop: '20px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'underline' }}
                >
                    Reset Progress (Start Over)
                </button>
            </div>
        </div>
    );
};

export default LevelPath;
