import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Zap, Calendar, Award, ChevronRight, Settings, BookOpen, MessageSquare } from 'lucide-react';
import { lessonsData } from '../data/lessons';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        level: 1,
        xp: 0,
        streak: 1,
        lessonsCompleted: 0
    });

    const badges = [
        { id: 'beg', title: 'Novice', icon: '🌱', minLevel: 1, desc: 'Started the journey' },
        { id: 'int', title: 'Traveler', icon: '✈️', minLevel: 11, desc: 'Can handle conversations' },
        { id: 'exp', title: 'Expert', icon: '🎓', minLevel: 24, desc: 'Fluent in French' },
        { id: 'mast', title: 'Master', icon: '👑', minLevel: 35, desc: 'Completed the Quest' },
    ];

    useEffect(() => {
        const savedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');
        const savedStreak = parseInt(localStorage.getItem('streak') || '1');

        setStats({
            level: savedLevel,
            xp: savedLevel * 50,
            streak: savedStreak,
            lessonsCompleted: savedLevel - 1
        });
    }, []);

    return (
        <div className="profile-page container animate-fade-in">
            <header className="profile-header">
                <div className="profile-hero glass-panel">
                    <div className="avatar-section">
                        <div className="avatar-wrapper">
                            <span className="avatar-emoji">😎</span>
                            <div className="level-badge-float">{stats.level}</div>
                        </div>
                        <div className="user-info">
                            <h1>Language Explorer</h1>
                            <p>Premium Member</p>
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat-item">
                            <span className="stat-value">{stats.xp}</span>
                            <span className="stat-label">Total XP</span>
                        </div>
                        <div className="hero-stat-item">
                            <span className="stat-value">{stats.streak}</span>
                            <span className="stat-label">Day Streak</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="profile-content-grid">
                <section className="stats-section glass-panel">
                    <h3 className="section-title">Statistics</h3>
                    <div className="stats-list">
                        <div className="stat-row">
                            <div className="stat-icon-bg primary"><BookOpen size={20} /></div>
                            <div className="stat-details">
                                <span>Lessons Finished</span>
                                <strong>{stats.lessonsCompleted} Modules</strong>
                            </div>
                        </div>
                        <div className="stat-row">
                            <div className="stat-icon-bg accent"><Award size={20} /></div>
                            <div className="stat-details">
                                <span>Achievements</span>
                                <strong>{badges.filter(b => stats.level >= b.minLevel).length} Unlocked</strong>
                            </div>
                        </div>
                        <div className="stat-row">
                            <div className="stat-icon-bg success"><Calendar size={20} /></div>
                            <div className="stat-details">
                                <span>Last Activity</span>
                                <strong>Today</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="badges-section glass-panel">
                    <h3 className="section-title">Badge Collection</h3>
                    <div className="badges-grid">
                        {badges.map(badge => {
                            const isUnlocked = stats.level >= badge.minLevel;
                            return (
                                <div key={badge.id} className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                    <div className="badge-visual">
                                        <span className="badge-emoji">{badge.icon}</span>
                                        {!isUnlocked && <div className="lock-overlay">🔒</div>}
                                    </div>
                                    <div className="badge-meta">
                                        <h4>{badge.title}</h4>
                                        <p>{isUnlocked ? badge.desc : 'Level ' + badge.minLevel + ' Required'}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="quick-actions glass-panel">
                    <h3 className="section-title">Quick Actions</h3>
                    <div className="actions-grid">
                        <button className="action-card glass" onClick={() => navigate('/lessons')}>
                            <Zap size={24} className="text-primary" />
                            <span>Continue Learning</span>
                            <ChevronRight size={18} />
                        </button>
                        <button className="action-card glass" onClick={() => navigate('/chat')}>
                            <MessageSquare size={24} className="text-accent" />
                            <span>Practice with AI</span>
                            <ChevronRight size={18} />
                        </button>
                        <button className="action-card glass" onClick={() => navigate('/level-path')}>
                            <Award size={24} className="text-success" />
                            <span>View Roadmap</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
