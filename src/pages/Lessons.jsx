import React, { useState } from 'react';
import { lessonsData } from '../data/lessons';
import { Play, Star, Clock, X, Volume2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { useLanguage } from '../context/LanguageContext';
import './Lessons.css';

const Lessons = () => {
    const [activeLesson, setActiveLesson] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeTab, setActiveTab] = useState('Beginner'); // Category toggle
    const { playBlip, playCardSound } = useSound();
    const { targetLanguage } = useLanguage();

    const openLesson = (lesson) => {
        playCardSound();
        setActiveLesson(lesson);
        setCurrentSlide(0);
        setIsFlipped(false);
    };

    const closeLesson = () => {
        playBlip();
        setActiveLesson(null);
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

    // Helper to get available voices
    const getFrenchVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(voice => voice.lang.includes('fr')) || voices.find(voice => voice.lang.includes('en'));
    };

    const playAudio = (e, text) => {
        e.stopPropagation();

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { 'French': 'fr-FR', 'Spanish': 'es-ES', 'German': 'de-DE' };
        utterance.lang = langMap[targetLanguage] || 'fr-FR';
        utterance.rate = 0.8;

        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
        if (voice) utterance.voice = voice;

        // Force volume
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);

        // Debug log
        console.log("Speaking:", text);
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
                        className={`tab-btn ${activeTab === 'Conversation' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('Conversation'); playBlip(); }}
                    >
                        Conversation
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

            {/* Lesson Modal */}
            {activeLesson && (
                <div className="lesson-modal-overlay">
                    <div className="lesson-modal glass-panel animate-fade-in">
                        <button className="close-btn" onClick={closeLesson}>
                            <X size={24} />
                        </button>

                        <div className="modal-header">
                            <h2>{activeLesson[targetLanguage.toLowerCase() + 'Title'] || activeLesson.title}</h2>
                            <div className="progress-indicator">
                                {currentSlide + 1} / {activeLesson.content.length}
                            </div>
                        </div>

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
                        </div>

                        <button
                            className="nav-btn next"
                            onClick={nextSlide}
                            disabled={currentSlide === activeLesson.content.length - 1}
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lessons;
