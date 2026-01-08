import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { lessonsData } from '../data/lessons';
import { Trophy, RefreshCw, Star, Zap, Brain, ArrowRight, X, ChevronLeft, ChevronRight, Volume2, Play, Clock } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import './Lessons.css';

const Lessons = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeLesson, setActiveLesson] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeTab, setActiveTab] = useState('Beginner'); // Category toggle
    const { playBlip, playCardSound, playSuccess } = useSound();
    const { targetLanguage } = useLanguage();
    const [isPlayingAll, setIsPlayingAll] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);

    useEffect(() => {
        if (location.state && location.state.openLessonId) {
            const lesson = lessonsData.find(l => l.id === location.state.openLessonId);
            if (lesson) {
                setActiveLesson(lesson);
                setActiveTab(lesson.level);
            }
        }
    }, [location.state]);

    const handleFinish = (levelNumber) => {
        playSuccess();
        setShowCompletion(true);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#ec4899', '#10b981']
        });

        // --- Streak Logic ---
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem('lastActivityDate');
        let currentStreak = parseInt(localStorage.getItem('streak') || '0');

        if (lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate === yesterday.toDateString()) {
                currentStreak += 1;
            } else {
                currentStreak = 1;
            }
            localStorage.setItem('streak', currentStreak.toString());
            localStorage.setItem('lastActivityDate', today);
        }
        // ---------------------

        if (levelNumber) {
            const currentUnlocked = parseInt(localStorage.getItem('unlockedLevel') || '1');
            if (levelNumber >= currentUnlocked) {
                localStorage.setItem('unlockedLevel', (levelNumber + 1).toString());
            }
        }
    };

    const handleProceed = () => {
        setShowCompletion(false);
        setActiveLesson(null);
        if (location.state?.from === 'level-path') {
            navigate('/level-path');
        }
    };

    const openLesson = (lesson) => {
        playCardSound();
        setActiveLesson(lesson);
        setCurrentSlide(0);
        setIsFlipped(false);
    };

    const closeLesson = () => {
        playBlip();
        setActiveLesson(null);
        if (location.state?.from === 'level-path') {
            navigate('/level-path');
        }
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        if (currentSlide < activeLesson.content.length - 1) {
            playBlip();
            setCurrentSlide(curr => curr + 1);
            setIsFlipped(false);
        }
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        if (currentSlide > 0) {
            playBlip();
            setCurrentSlide(curr => curr - 1);
            setIsFlipped(false);
        }
    };

    const playFullLessonAudio = () => {
        if (isPlayingAll) {
            window.speechSynthesis.cancel();
            setIsPlayingAll(false);
            return;
        }

        setIsPlayingAll(true);
        window.speechSynthesis.cancel();
        let index = 0;

        const playNext = () => {
            if (index >= activeLesson.content.length) {
                setIsPlayingAll(false);
                return;
            }

            const item = activeLesson.content[index];
            const text = item[targetLanguage.toLowerCase()] || item.french;
            const utterance = new SpeechSynthesisUtterance(text);

            const langMap = { 'French': 'fr-FR', 'Spanish': 'es-ES', 'German': 'de-DE' };
            utterance.lang = langMap[targetLanguage] || 'fr-FR';
            utterance.rate = 0.9;

            utterance.onend = () => {
                index++;
                setTimeout(() => {
                    if (window.speechSynthesis.pending || window.speechSynthesis.speaking || index < activeLesson.content.length) {
                        playNext();
                    }
                }, 600);
            };

            if (!document.querySelector('.lesson-modal-overlay')) {
                setIsPlayingAll(false);
                return;
            }

            window.speechSynthesis.speak(utterance);
        };

        playNext();
    };

    const playAudio = (e, text) => {
        e.stopPropagation();
        window.speechSynthesis.cancel();
        const speechText = text.length === 1 ? text.toLowerCase() : text;
        const utterance = new SpeechSynthesisUtterance(speechText);
        const langMap = { 'French': 'fr-FR', 'Spanish': 'es-ES', 'German': 'de-DE' };
        utterance.lang = langMap[targetLanguage] || 'fr-FR';
        utterance.rate = 0.8;
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
        if (voice) utterance.voice = voice;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const filteredLessons = lessonsData.filter(l => l.level === activeTab);

    return (
        <div className="lessons-page container">
            <div className="lessons-header">
                <h1 className="page-title">Curriculum</h1>
                <p className="page-subtitle">Structured modules to build your confidence step by step.</p>

                <div className="category-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'Beginner' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('Beginner'); playBlip(); }}
                    >
                        Beginner
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'Intermediate' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('Intermediate'); playBlip(); }}
                    >
                        Intermediate
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'Expert' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('Expert'); playBlip(); }}
                    >
                        Expert
                    </button>
                </div>
            </div>

            <div className="lessons-grid">
                {filteredLessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-card glass-panel" onClick={() => openLesson(lesson)}>
                        <div className="card-image-wrapper">
                            <img src={lesson.image} alt={lesson.title} className="card-image" />
                            <div className="card-overlay">
                                <button className="play-btn">
                                    <Play size={24} fill="currentColor" />
                                </button>
                            </div>
                            <span className="level-badge">{lesson.level}</span>
                        </div>

                        <div className="card-content">
                            <div className="card-meta">
                                <span className="meta-item"><Clock size={14} /> 10 min</span>
                                <span className="meta-item"><Star size={14} /> +50 XP</span>
                            </div>
                            <h3>{lesson[targetLanguage.toLowerCase() + 'Title'] || lesson.title}</h3>
                            <p>{lesson[targetLanguage.toLowerCase() + 'Subtitle'] || lesson.subtitle}</p>

                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {activeLesson && (
                <div className="lesson-modal-overlay">
                    {showCompletion ? (
                        <div className="completion-screen glass-panel animate-zoom-in">
                            <div className="trophy-wrapper">
                                <Trophy size={80} className="trophy-icon" />
                            </div>
                            <h2 className="text-gradient">Félicitations !</h2>
                            <p>You've mastered this lesson and unlocked the next challenge!</p>

                            <div className="reward-stats">
                                <div className="stat-pill">
                                    <Star size={20} fill="var(--accent)" />
                                    <span>+50 XP</span>
                                </div>
                                <div className="stat-pill">
                                    <Zap size={20} fill="var(--success)" />
                                    <span>Goal Met</span>
                                </div>
                            </div>

                            <button className="btn btn-primary btn-glow" onClick={handleProceed}>
                                {location.state?.from === 'level-path' ? 'Back to Journey' : 'Continue Learning'}
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="lesson-modal glass-panel animate-fade-in">
                            <button className="close-btn" onClick={closeLesson}>
                                <X size={24} />
                            </button>

                            <div className="modal-header">
                                <div className="header-main-info">
                                    <h2>{activeLesson[targetLanguage.toLowerCase() + 'Title'] || activeLesson.title}</h2>
                                    <button
                                        className={`btn-play-all ${isPlayingAll ? 'playing' : ''}`}
                                        onClick={playFullLessonAudio}
                                    >
                                        {isPlayingAll ? <X size={16} /> : <Volume2 size={16} />}
                                        {isPlayingAll ? 'Stop Audio' : 'Play Full Lesson'}
                                    </button>
                                </div>
                                <div className="progress-indicator">
                                    {currentSlide + 1} / {activeLesson.content.length}
                                </div>
                            </div>

                            {activeLesson.type === 'dialogue' ? (
                                <div className="dialogue-container animate-fade-in">
                                    {activeLesson.content.map((item, idx) => (
                                        <div key={idx} className={`dialogue-bubble ${idx % 2 === 0 ? 'left' : 'right'} animate-slide-up`} style={{ animationDelay: `${idx * 150}ms` }}>
                                            <div className="bubble-content">
                                                <div className="bubble-header">
                                                    <p className="txt-fr">{item[targetLanguage.toLowerCase()] || item.french}</p>
                                                    <button className="btn-mini-voice" onClick={(e) => { e.stopPropagation(); playAudio(e, item[targetLanguage.toLowerCase()] || item.french); }}>
                                                        <Volume2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="txt-en">{item.english}</p>
                                                <div className="bubble-actions">
                                                    <span className="txt-pron">{item[targetLanguage.toLowerCase().substring(0, 3) + 'Pronunciation'] || item.pronunciation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="dialogue-footer">
                                        <Trophy size={40} className="text-accent" />
                                        <h3>Excellent Progress!</h3>
                                        <p>Conversation Complete! +50 XP</p>
                                        <button className="btn btn-primary" onClick={() => handleFinish(location.state?.levelNumber)}>
                                            Finish Lesson
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flashcard-container">
                                    <button
                                        className="nav-btn prev"
                                        onClick={prevSlide}
                                        disabled={currentSlide === 0}
                                    >
                                        <ChevronLeft size={32} />
                                    </button>

                                    <div
                                        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                                        onClick={() => { setIsFlipped(!isFlipped); playCardSound(); }}
                                    >
                                        <div className="card-top">
                                            <span className="card-count">{currentSlide + 1} / {activeLesson.content.length}</span>
                                            <button className="btn-voice" onClick={(e) => { e.stopPropagation(); playAudio(e, activeLesson.content[currentSlide][targetLanguage.toLowerCase()] || activeLesson.content[currentSlide].french); }}>
                                                <Volume2 size={20} />
                                            </button>
                                        </div>
                                        <div className="card-face front">
                                            <span className="sc-label">{targetLanguage}</span>
                                            <div className="sc-content">
                                                {activeLesson.content[currentSlide][targetLanguage.toLowerCase()] || activeLesson.content[currentSlide].french}
                                            </div>
                                            <div
                                                className="sc-pronunciation"
                                                onClick={(e) => playAudio(e, activeLesson.content[currentSlide][targetLanguage.toLowerCase()] || activeLesson.content[currentSlide].french)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Volume2 size={16} />
                                                {activeLesson.content[currentSlide][targetLanguage.toLowerCase().substring(0, 3) + 'Pronunciation'] || activeLesson.content[currentSlide].pronunciation}
                                            </div>
                                        </div>
                                        <div className="card-face back">
                                            <span className="sc-label">English</span>
                                            <div className="sc-content">{activeLesson.content[currentSlide].english}</div>
                                        </div>
                                        <p className="sc-hint">Click to flip</p>
                                    </div>

                                    <button
                                        className="nav-btn next"
                                        onClick={nextSlide}
                                        disabled={currentSlide === activeLesson.content.length - 1}
                                    >
                                        <ChevronRight size={32} />
                                    </button>

                                    {currentSlide === activeLesson.content.length - 1 && (
                                        <div className="finish-overlay animate-fade-in">
                                            <button className="btn btn-primary btn-glow" onClick={() => handleFinish(location.state?.levelNumber)}>
                                                Finish & Unlock Next Level
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Lessons;
