import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, AlertCircle, Mic, MicOff, Volume2, Settings, VolumeX, HelpCircle, X, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLanguage } from '../context/LanguageContext';
import './Chat.css';

const Chat = () => {
    const { targetLanguage } = useLanguage();

    const INITIAL_MESSAGE = {
        id: 1,
        sender: 'ai',
        text: targetLanguage === 'French'
            ? "Bonjour! I'm Lumière, your French tutor. I can help you learn French using English and Roman Urdu. What would you like to learn today?"
            : targetLanguage === 'Spanish'
                ? "¡Hola! I'm Lumière, your Spanish tutor. I can help you learn Spanish using English and Roman Urdu. What would you like to learn today?"
                : "Hallo! I'm Lumière, your German tutor. I can help you learn German using English and Roman Urdu. What would you like to learn today?"
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
        const utterance = new SpeechSynthesisUtterance(text);

        const langCodes = {
            'French': 'fr-FR',
            'Spanish': 'es-ES',
            'German': 'de-DE'
        };
        utterance.lang = langCodes[targetLanguage] || 'en-US';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
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

            const chat = model.startChat({
                history: history.map(msg => ({
                    role: msg.sender === 'ai' ? 'model' : 'user',
                    parts: [{ text: msg.text }],
                })).filter(msg => msg.role !== 'model' || msg.parts[0].text !== INITIAL_MESSAGE.text),
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7,
                },
                systemInstruction: {
                    role: "system",
                    parts: [{
                        text: `You are Lumière, a friendly and energetic ${targetLanguage} tutor. You are an expert in Roman Urdu, English, and ${targetLanguage}.

YOUR MISSION:
Explain ${targetLanguage} words and concepts using a natural mix of English and Roman Urdu.

COMMUNICATION RULES:
1. Stay conversational but focused. After a friendly greeting, get straight to the point.
2. Mix English and Roman Urdu naturally (Latin script).
3. When teaching a word or phrase, ALWAYS use this EXACT format with a NEW LINE for each item:
   **${targetLanguage}:** [Word]
   **Matlab/Meaning:** [English/Roman Urdu Meaning]
   **Pronunciation:** [Easy to read guide]
4. ALWAYS provide the translation for any specific word the user asks about or any greeting.
5. Be encouraging: 'Zabardast!', 'Excellent!', 'Bohat khoob!'.
6. Do not let responses cut off. Keep them concise but complete.` }]
                }
            });

            const result = await chat.sendMessage(userInput);
            const response = await result.response;
            return response.text();
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

        const responseText = await generateResponse(currentHistory, userMsg.text);

        const aiMsg = {
            id: Date.now() + 1,
            sender: 'ai',
            text: responseText
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        speak(responseText); // Automatic TTS for response
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
                                {msg.sender === 'ai' && (
                                    <div className="speech-controls">
                                        <button className="speak-msg-btn" onClick={() => speak(msg.text)}>
                                            <Volume2 size={14} /> Listen
                                        </button>
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
