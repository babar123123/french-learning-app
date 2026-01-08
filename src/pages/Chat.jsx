import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, AlertCircle, Mic, MicOff, Volume2, Settings, VolumeX, HelpCircle, X, ExternalLink, Eye, EyeOff, Languages } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLanguage } from '../context/LanguageContext';
import './Chat.css';

const Chat = () => {
    const { targetLanguage } = useLanguage();

    const INITIAL_MESSAGE = {
        id: 1,
        sender: 'ai',
        text: targetLanguage === 'French'
            ? "Bonjour! I'm Lumière, your French tutor. I'm here to practice French with you. Ready?"
            : targetLanguage === 'Spanish'
                ? "¡Hola! I'm Lumière, your Spanish tutor. I'm here to practice Spanish with you. Ready?"
                : "Hallo! I'm Lumière, your German tutor. I'm here to practice German with you. Ready?",
        translation_en: "Hello! I'm Lumière, your tutor. I'm here to practice with you. Ready?",
        translation_ur: "Asalam-o-alaikum! Main Lumière hoon, aapki tutor. Main yahan aapke saath practice karne ke liye hoon. Tayyar hain?",
        showTranslation: null,
        showMenu: false
    };

    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Reset chat when language changes
    useEffect(() => {
        setMessages([INITIAL_MESSAGE]);
    }, [targetLanguage]);

    useEffect(() => {
        window.scrollTo(0, 0); // Open page from start
    }, []);

    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('gemini_api_key'));
    const [showHelp, setShowHelp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const voicesRef = useRef([]);

    // Load voices for better mobile support
    useEffect(() => {
        const loadVoices = () => {
            voicesRef.current = window.speechSynthesis.getVoices();
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US'; // Best for mixed Roman Urdu/English

            recognitionRef.current.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                if (transcript) {
                    setInputText(transcript);
                    console.log("Speach detected:", transcript);
                }
            };

            recognitionRef.current.onerror = (e) => {
                console.error("Mic error:", e.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Speech recognition error:", e);
            }
        }
    };

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        // Small delay to ensure cancellation finishes on mobile
        setTimeout(() => {
            const cleanText = text.replace(/[*#_\[\]]/g, '').trim();
            if (!cleanText) return;

            const langCodes = { 'French': 'fr-FR', 'Spanish': 'es-ES', 'German': 'de-DE' };
            const targetLangCode = langCodes[targetLanguage] || 'en-US';

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = targetLangCode;

            const availableVoices = window.speechSynthesis.getVoices();
            const preferredVoice = availableVoices.find(v =>
                v.lang.toLowerCase().replace('_', '-') === targetLangCode.toLowerCase() &&
                (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
            ) || availableVoices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLangCode.toLowerCase());

            if (preferredVoice) utterance.voice = preferredVoice;

            // Stable Mobile Settings
            utterance.rate = 0.8;
            utterance.pitch = 1.05;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }, 100);
    };

    const stopSpeak = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Only scroll to bottom if we have an actual conversation (more than just the welcome message)
        if (messages.length > 1 || isTyping) {
            scrollToBottom();
        }
    }, [messages, isTyping]);

    const saveKey = (key) => {
        localStorage.setItem('gemini_api_key', key);
        setApiKey(key);
        setShowKeyInput(false);
    };

    const generateResponse = async (history, userInput) => {
        // If no key, fall back to simulation
        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            const responses = [
                "C'est très intéressant ! Dites-m'en plus.",
                "Ah, je vois. En français, on dirait plutôt...",
                "Excellent ! Continuez comme ça.",
                "Je comprends. Avez-vous déjà visité Paris ?",
                "C'est magnifique ! J'aime beaucoup votre enthousiasme.",
                "Pardon, je suis un bot de simulation sans clé API. Ajoutez une clé pour que je sois intelligent !"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            // Process history to ensure it strictly starts with a 'user' message
            const processedHistory = history
                .map(msg => ({
                    role: msg.sender === 'ai' ? 'model' : 'user',
                    parts: [{ text: msg.text }],
                }))
                .filter(msg => msg.parts[0].text !== INITIAL_MESSAGE.text);

            // Gemini REQUIRES history to start with 'user' role.
            const firstUserIndex = processedHistory.findIndex(m => m.role === 'user');
            const validHistory = firstUserIndex !== -1 ? processedHistory.slice(firstUserIndex) : [];

            const chat = model.startChat({
                history: validHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7,
                },
                systemInstruction: {
                    role: "system",
                    parts: [{
                        text: `You are Lumière, a friendly ${targetLanguage} tutor.
                        
IMPORTANT: You MUST always respond ONLY in a raw JSON format like this:
{
  "text": "[Continuous ${targetLanguage} response here]",
  "translation_en": "[Clear translation in English here]",
  "translation_ur": "[Clear translation in Roman Urdu here]"
}

RULES:
1. The 'text' field MUST be 100% in ${targetLanguage}. No English/Urdu.
2. The 'translation_en' must be plain English.
3. The 'translation_ur' must be Roman Urdu (Urdu written in Latin script).
4. Keep the conversation natural and encouraging.
5. Correct user mistakes in the translation fields if needed.
6. Do NOT include any markdown outside the JSON.` }]
                }
            });

            const result = await chat.sendMessage(userInput);
            const response = await result.response;
            const text = response.text();

            try {
                // Robust JSON extraction: Find the first { and last }
                const start = text.indexOf('{');
                const end = text.lastIndexOf('}');

                if (start !== -1 && end !== -1) {
                    const jsonPart = text.substring(start, end + 1);
                    return JSON.parse(jsonPart);
                }

                // Fallback for non-JSON or partial response
                return {
                    text: text,
                    translation_en: "Translation unavailable.",
                    translation_ur: "Tarjuma dastyab nahi."
                };
            } catch (e) {
                console.error("JSON Extraction Error:", e);
                return {
                    text: text,
                    translation_en: "Error. Try again.",
                    translation_ur: "Masla ho gaya. Dubara koshish karein."
                };
            }
        } catch (error) {
            console.error("API Error detailed:", error);

            // Attempt to list available models to debug
            let debugInfo = "";
            try {
                const listRequest = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const listData = await listRequest.json();
                if (listData.models) {
                    const modelNames = listData.models.map(m => m.name).join(", ");
                    debugInfo = ` | Available models: ${modelNames}`;
                }
            } catch (e) {
                debugInfo = " | Could not list models.";
            }

            return `Desolé, error connection. ${error.message}${debugInfo}`;
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: inputText

        };

        const currentHistory = messages;
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const currentHistory = messages.slice(-10);
            const responseData = await generateResponse(currentHistory, userMsg.text);

            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: typeof responseData === 'object' ? responseData.text : responseData,
                translation_en: responseData.translation_en || null,
                translation_ur: responseData.translation_ur || null,
                showTranslation: null,
                showMenu: false
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
            speak(aiMsg.text);
        } catch (err) {
            setIsTyping(false);
            const errMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: "Désolé, an error occurred: " + err.message,
                isError: true
            };
            setMessages(prev => [...prev, errMsg]);
        }
    };

    const setTranslationLang = (id, lang) => {
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, showTranslation: msg.showTranslation === lang ? null : lang } : msg
        ));
    };

    const toggleTransMenu = (id) => {
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, showMenu: !msg.showMenu } : msg
        ));
    };

    return (
        <div className="chat-page container animate-fade-in">
            <div className="chat-page-header">
                <h1 className="text-gradient">AI Tutor Duo</h1>
                <p className="subtitle">Practice your {targetLanguage} conversationally with Lumière.</p>
            </div>

            <div className="chat-container glass-panel">
                <div className="chat-header">
                    <div className="ai-profile">
                        <div className="avatar-wrapper">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3>Lumière AI</h3>
                            <span className="status-dot">Online</span>
                        </div>
                    </div>

                    <div className="header-actions">
                        {isSpeaking && (
                            <button className="stop-global-btn" onClick={stopSpeak} title="Stop AI Voice">
                                <VolumeX size={18} /> Stop
                            </button>
                        )}
                        <button
                            className="btn-icon-only"
                            onClick={() => setShowKeyInput(!showKeyInput)}
                            title="API Settings"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {showKeyInput && (
                    <div className="api-key-banner">
                        <div className="api-content">
                            <AlertCircle size={20} className="text-accent" />
                            <p>To enable real intelligence, enter your Gemini API Key.</p>
                            <button className="help-btn" onClick={() => setShowHelp(true)}>
                                <HelpCircle size={16} /> How to get a key?
                            </button>
                        </div>
                        <div className="api-input-group">
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Paste API Key here..."
                                    className="key-input"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <button
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    type="button"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => saveKey(apiKey)}>
                                Save Key
                            </button>
                        </div>
                    </div>
                )}

                {showHelp && (
                    <>
                        <div className="modal-overlay" onClick={() => setShowHelp(false)}></div>
                        <div className="api-help-modal glass-panel">
                            <div className="help-header">
                                <h3><Sparkles size={18} /> How to get your API Key</h3>
                                <button className="close-help" onClick={() => setShowHelp(false)}><X size={20} /></button>
                            </div>
                            <div className="help-steps">
                                <div className="step">
                                    <span className="step-num">1</span>
                                    <p>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio <ExternalLink size={12} /></a></p>
                                </div>
                                <div className="step">
                                    <span className="step-num">2</span>
                                    <p>Click on <strong>"Create API key"</strong> button.</p>
                                </div>
                                <div className="step">
                                    <span className="step-num">3</span>
                                    <p>Copy the generated key and paste it here.</p>
                                </div>
                            </div>
                            <p className="help-note">Note: Gemini API is free for students and developers (within limits).</p>
                        </div>
                    </>
                )}

                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            <div className="message-avatar">
                                {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className="message-content">
                                <p>{msg.text}</p>
                                {msg.showTranslation && (
                                    <div className="message-translation animate-fade-in">
                                        <em>{msg.showTranslation === 'en' ? msg.translation_en : msg.translation_ur}</em>
                                    </div>
                                )}
                                {msg.sender === 'ai' && (
                                    <div className="speech-controls">
                                        <button className="speak-msg-btn" onClick={() => speak(msg.text)}>
                                            <Volume2 size={14} /> Listen
                                        </button>

                                        <div className="translation-wrapper">
                                            <button
                                                className={`speak-msg-btn translate-btn ${msg.showMenu ? 'active' : ''}`}
                                                onClick={() => toggleTransMenu(msg.id)}
                                            >
                                                <Languages size={14} /> Translate
                                            </button>

                                            {msg.showMenu && (
                                                <div className="translation-options slide-in">
                                                    <button
                                                        className={`speak-msg-btn trans-opt ${msg.showTranslation === 'en' ? 'active' : ''}`}
                                                        onClick={() => setTranslationLang(msg.id, 'en')}
                                                    >
                                                        English
                                                    </button>
                                                    <button
                                                        className={`speak-msg-btn trans-opt ${msg.showTranslation === 'ur' ? 'active' : ''}`}
                                                        onClick={() => setTranslationLang(msg.id, 'ur')}
                                                    >
                                                        Urdu
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {isSpeaking && (
                                            <button className="speak-msg-btn mute-btn" onClick={stopSpeak}>
                                                <VolumeX size={14} /> Stop
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message ai">
                            <div className="message-avatar"><Bot size={20} /></div>
                            <div className="message-content typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={isListening ? "Listening... Speak now!" : `Type your message in ${targetLanguage}...`}
                        className={`chat-input ${isListening ? 'active-listening' : ''}`}
                    />
                    <button
                        type="button"
                        className={`mic-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleListening}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button type="submit" className="btn btn-primary send-btn" disabled={!inputText.trim() && !isListening}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
