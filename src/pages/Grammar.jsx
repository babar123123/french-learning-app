import React, { useState } from 'react';
import { Book, CheckCircle, ArrowLeft, GraduationCap, MessageCircle, Star, Info, Activity, Layers, MousePointer, Compass, Layout, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Grammar.css';

const Grammar = () => {
    const navigate = useNavigate();
    const { targetLanguage } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('all');

    const grammarData = [
        {
            id: 'verbs',
            category: "Verbs & Tenses",
            icon: <Activity size={18} />,
            sections: [
                {
                    title: "Essential Verbs (Must Know)",
                    items: [
                        { fr: "Être (To be)", conj: "Je suis, Tu es, Il est, Nous sommes, Vous êtes, Ils sont" },
                        { fr: "Avoir (To have)", conj: "J'ai, Tu as, Il a, Nous avons, Vous avez, Ils ont" },
                        { fr: "Aller (To go)", conj: "Je vais, Tu vas, Il va, Nous allons, Vous allez, Ils vont" },
                        { fr: "Faire (To do/make)", conj: "Je fais, Tu fais, Il fait, Nous faisons, Vous faites, Ils font" }
                    ]
                },
                {
                    title: "Regular Verb Patterns (-ER)",
                    items: [
                        { fr: "Parler (To speak)", conj: "Je parl-e, Tu parl-es, Il parl-e, Nous parl-ons, Vous parl-ez, Ils parl-ent" }
                    ]
                }
            ]
        },
        {
            id: 'basics',
            category: "The Basics",
            icon: <Layers size={18} />,
            sections: [
                {
                    title: "Subject Pronouns",
                    items: [
                        { fr: "Je / Tu / Il / Elle", conj: "I / You (singular) / He / She" },
                        { fr: "On", conj: "We (informal) / One / People" },
                        { fr: "Nous / Vous / Ils / Elles", conj: "We / You (plural/formal) / They (m) / They (f)" }
                    ]
                },
                {
                    title: "Articles & Gender",
                    items: [
                        { fr: "Definite (The)", conj: "Le (m), La (f), L' (vowel), Les (plural)" },
                        { fr: "Indefinite (A/Some)", conj: "Un (m), Une (f), Des (plural)" }
                    ]
                }
            ]
        },
        {
            id: 'sentence',
            category: "Sentence Building",
            icon: <Layout size={18} />,
            sections: [
                {
                    title: "Negation (Not)",
                    items: [
                        { fr: "Ne ... Pas", conj: "Structure: Subject + ne + verb + pas. Example: Je ne parle pas (I don't speak)." }
                    ]
                },
                {
                    title: "Questions",
                    items: [
                        { fr: "Qui / Que / Quand", conj: "Who / What / When" },
                        { fr: "Où / Pourquoi / Comment", conj: "Where / Why / How" },
                        { fr: "Est-ce que ...", conj: "Used to start a question. Example: Est-ce que tu manges?" }
                    ]
                }
            ]
        },
        {
            id: 'adjectives',
            category: "Describing Stuff",
            icon: <MousePointer size={18} />,
            sections: [
                {
                    title: "Possessive Adjectives",
                    items: [
                        { fr: "My", conj: "Mon (m), Ma (f), Mes (pl)" },
                        { fr: "Your (singular)", conj: "Ton (m), Ta (f), Tes (pl)" },
                        { fr: "His/Her/Its", conj: "Son (m), Sa (f), Ses (pl)" }
                    ]
                },
                {
                    title: "Common Adjectives",
                    items: [
                        { fr: "Grand / Petit", conj: "Big / Small" },
                        { fr: "Bon / Mauvais", conj: "Good / Bad" },
                        { fr: "Beau / Belle", conj: "Beautiful (m/f)" }
                    ]
                }
            ]
        },
        {
            id: 'tenses',
            category: "Past & Future",
            icon: <Clock size={18} />,
            sections: [
                {
                    title: "Past Tense (Passé Composé)",
                    items: [
                        { fr: "Structure", conj: "Subject + Avoir/Être + Past Participle" },
                        { fr: "Example (Avoir)", conj: "J'ai parlé (I spoke), Tu as mangé (You ate)" },
                        { fr: "Example (Être)", conj: "Je suis allé (I went) - used for movement verbs" }
                    ]
                },
                {
                    title: "Future (Futur Proche)",
                    items: [
                        { fr: "Structure", conj: "Subject + Aller (conjugated) + Infinitive" },
                        { fr: "Example", conj: "Je vais manger (I am going to eat), Nous allons partir (We are going to leave)" }
                    ]
                }
            ]
        },
        {
            id: 'prepositions',
            category: "Prepositions",
            icon: <Compass size={18} />,
            sections: [
                {
                    title: "Place & Direction",
                    items: [
                        { fr: "À / Au / À la", conj: "To / At (Au for m, À la for f)" },
                        { fr: "En / Dans", conj: "In / Inside" },
                        { fr: "Chez", conj: "At the house/place of... (Chez moi - At my house)" }
                    ]
                }
            ]
        },
        {
            id: 'directions',
            category: "Directions",
            icon: <Compass size={18} />,
            sections: [
                {
                    title: "Giving Directions",
                    items: [
                        { fr: "À gauche / À droite", conj: "On the left / On the right" },
                        { fr: "Tout droit", conj: "Straight ahead" },
                        { fr: "Devant / Derrière", conj: "In front / Behind" },
                        { fr: "Ici / Là / Là-bas", conj: "Here / There / Over there" },
                        { fr: "En haut / En bas", conj: "Up / Down" },
                        { fr: "À côté de / Loin de", conj: "Next to / Far from" }
                    ]
                }
            ]
        }
    ];

    const [playingId, setPlayingId] = useState(null);

    const speak = (text, id) => {
        if (!window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Map target language to speech codes
        const langCodes = {
            'French': 'fr-FR',
            'Spanish': 'es-ES',
            'German': 'de-DE'
        };

        utterance.lang = langCodes[targetLanguage] || 'fr-FR';
        utterance.rate = 0.9;

        setPlayingId(id);

        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);

        window.speechSynthesis.speak(utterance);
    };

    const filteredData = activeCategory === 'all'
        ? grammarData
        : grammarData.filter(d => d.id === activeCategory);

    return (
        <div className="grammar-page container animate-fade-in">
            <header className="grammar-header-simple">
                <div className="nav-row">
                    <button className="back-link" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back to Path
                    </button>
                </div>

                <h1 className="text-gradient">Grammar Mastery</h1>

                <div className="category-filter">
                    <button
                        className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >All Topics</button>
                    {grammarData.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.icon} {cat.category}
                        </button>
                    ))}
                </div>

                <div className="grammar-notice glass-panel animate-fade-in">
                    <Info size={18} />
                    <p>
                        Exploring <strong>{targetLanguage}</strong>? These guides provide the essential pillars for your journey.
                        {targetLanguage !== 'French' && " Note: Advanced tenses currently focus on core structures common to Romance/Germanic roots."}
                    </p>
                </div>
            </header>

            <div className="grammar-content">
                {filteredData.map((cat) => (
                    <div key={cat.id} className="cat-block animate-slide-up">
                        <h2 className="cat-block-title">
                            <div className="accent-dot"></div>
                            {cat.category}
                        </h2>

                        <div className="cards-container">
                            {cat.sections.map((section, sidx) => (
                                <div key={sidx} className={`g-card glass-panel ${section.items.length > 5 ? 'wide' : ''}`}>
                                    <h3>{section.title}</h3>
                                    <div className="g-list">
                                        {section.items.map((item, iidx) => {
                                            const itemId = `${cat.id}-${sidx}-${iidx}`;
                                            return (
                                                <div
                                                    key={iidx}
                                                    className={`g-item ${playingId === itemId ? 'playing' : ''}`}
                                                    onClick={() => speak(item.fr, itemId)}
                                                >
                                                    <span className="g-text-fr">{item.fr}</span>
                                                    <span className="g-text-en">{item.conj}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grammar;
