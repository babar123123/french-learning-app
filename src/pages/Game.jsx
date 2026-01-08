import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Star, Zap, Brain, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { lessonsData } from '../data/lessons';
import confetti from 'canvas-confetti';
import './Game.css';

const Game = () => {
    const { targetLanguage } = useLanguage();
    const { playSuccess, playBlip, playCardSound, playTap } = useSound();

    const [gameState, setGameState] = useState('menu'); // menu, playing, result
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (gameState === 'result' && score >= 70) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    }, [gameState, score]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [options, setOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'

    // Multi-language labels
    const labels = {
        French: { title: "Défis Linguistiques", start: "Commencer", next: "Suivant", restart: "Rejouer" },
        Spanish: { title: "Desafío de Idiomas", start: "Empezar", next: "Siguiente", restart: "Reiniciar" },
        German: { title: "Sprach-Herausforderung", start: "Starten", next: "Nächste", restart: "Neustart" }
    }[targetLanguage] || { title: "Language Challenge", start: "Start", next: "Next", restart: "Restart" };

    const prepareGame = () => {
        // Collect words from lessons based on target language
        const langKey = targetLanguage.toLowerCase();
        let allWords = [];

        lessonsData.forEach(lesson => {
            lesson.content.forEach(item => {
                if (item[langKey]) {
                    allWords.push({
                        q: item.english,
                        a: item[langKey]
                    });
                } else if (targetLanguage === 'French') {
                    allWords.push({
                        q: item.english,
                        a: item.french
                    });
                }
            });
        });

        // Shuffle and pick 10 words
        const shuffled = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuestions(shuffled);
        generateOptions(shuffled[0], allWords);
        setScore(0);
        setCurrentQuestion(0);
        setGameState('playing');
        setFeedback(null);
    };

    const generateOptions = (currentQ, allPool) => {
        const others = allPool
            .filter(item => item.a !== currentQ.a)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const combined = [...others, currentQ].sort(() => 0.5 - Math.random());
        setOptions(combined);
    };

    const handleAnswer = (selected) => {
        if (feedback) return;

        if (selected === questions[currentQuestion].a) {
            setScore(prev => prev + 10);
            setFeedback('correct');
            playSuccess();
        } else {
            setFeedback('wrong');
            playBlip();
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                const nextIdx = currentQuestion + 1;
                setCurrentQuestion(nextIdx);
                generateOptions(questions[nextIdx], questions); // Use current session pool
                setFeedback(null);
            } else {
                setGameState('result');
            }
        }, 1500);
    };

    return (
        <div className="game-page container">
            <div className="game-container glass-panel">
                {gameState === 'menu' && (
                    <div className="game-menu animate-fade-in">
                        <div className="game-icon-circle">
                            <Brain size={48} />
                        </div>
                        <h1>{labels.title}</h1>
                        <p>Test your {targetLanguage} knowledge and earn XP!</p>
                        <div className="game-stats">
                            <div className="g-stat">
                                <Star className="text-accent" />
                                <span>10 Levels</span>
                            </div>
                            <div className="g-stat">
                                <Zap className="text-primary" />
                                <span>Fast Paced</span>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={() => { playSuccess(); prepareGame(); }}>
                            {labels.start} <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="game-play animate-scale-in">
                        <div className="game-header">
                            <div className="q-progress">
                                Question {currentQuestion + 1}/10
                                <div className="p-bar"><div className="p-fill" style={{ width: `${(currentQuestion + 1) * 10}%` }}></div></div>
                            </div>
                            <div className="game-score">
                                <Trophy size={18} className="text-accent" />
                                {score} XP
                            </div>
                        </div>

                        <div className="question-box">
                            <span className="q-label">Translate to {targetLanguage}:</span>
                            <h2 className="q-text">{questions[currentQuestion].q}</h2>
                        </div>

                        <div className="options-grid">
                            {options.map((opt, i) => (
                                <button
                                    key={i}
                                    className={`opt-btn ${feedback && opt.a === questions[currentQuestion].a ? 'correct' : ''} ${feedback === 'wrong' && opt.a !== questions[currentQuestion].a ? 'locked' : ''}`}
                                    onClick={() => handleAnswer(opt.a)}
                                    disabled={!!feedback}
                                >
                                    {opt.a}
                                </button>
                            ))}
                        </div>

                        {feedback && (
                            <div className={`feedback-banner ${feedback}`}>
                                {feedback === 'correct' ? 'Zabardast! Correct' : 'Opps! Wrong Answer'}
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="game-result animate-fade-in">
                        <Trophy size={80} className="text-accent trophy-anim" />
                        <h2>{score >= 70 ? '🎉 Congratulations! You Passed' : 'Level Complete!'}</h2>
                        {score >= 70 && <p className="success-msg">Zabardast! Aap ne naya record banaya hai!</p>}
                        <div className="final-score">
                            <div className="score-circle">
                                <span className="score-num">{score}</span>
                                <span className="score-xp">XP</span>
                            </div>
                        </div>
                        <p>You mastered {score / 10} out of 10 words.</p>
                        <button className="btn btn-primary" onClick={() => { playTap(); prepareGame(); }}>
                            <RefreshCw size={20} /> {labels.restart}
                        </button>
                        <button className="btn btn-secondary mt-4" onClick={() => { playBlip(); setGameState('menu'); }}>
                            Main Menu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
