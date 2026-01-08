import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessonsData } from '../data/lessons';
import { useSound } from '../context/SoundContext';
import { Lock, Star, Check, Trophy, Play, Star as StarOutline } from 'lucide-react';
import './LevelPath.css';

const LevelPath = () => {
    const navigate = useNavigate();
    const { playTap, playSuccess, playBlip } = useSound();

    // Total lessons mapped as levels
    const levels = lessonsData.map((lesson, index) => ({
        ...lesson,
        levelNumber: index + 1
    }));

    const [unlockedLevel, setUnlockedLevel] = useState(1);

    useEffect(() => {
        const savedLevel = localStorage.getItem('unlockedLevel');
        if (savedLevel) {
            setUnlockedLevel(parseInt(savedLevel));
        }
    }, []);

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
        <div className="level-path-container">
            <header className="path-header">
                <h1 className="text-gradient">Language Quest</h1>
                <div className="stats-pills">
                    <div className="pill glass"><Star size={16} fill="var(--accent)" /> {unlockedLevel * 50} XP</div>
                    <div className="pill glass"><Trophy size={16} fill="var(--primary)" /> Level {unlockedLevel}</div>
                </div>
            </header>

            <div className="roadmap-path">
                {levels.map((level, index) => {
                    const isUnlocked = level.levelNumber <= unlockedLevel;
                    const isCompleted = level.levelNumber < unlockedLevel;
                    const isNext = level.levelNumber === unlockedLevel;

                    // Zigzag logic
                    const xOffset = Math.sin(index * 1.5) * 50;

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
                                    <h4>Level {level.levelNumber}: {level.title}</h4>
                                    <p>{isUnlocked ? 'Click to Start' : 'Locked'}</p>
                                </div>

                                {isNext && (
                                    <div className="pulse-ring"></div>
                                )}
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
            </div>
        </div>
    );
};

export default LevelPath;
