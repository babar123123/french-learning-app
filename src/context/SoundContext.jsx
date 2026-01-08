import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(true);
    const bgMusicRef = useRef(new Audio('https://cdn.pixabay.com/audio/2022/10/14/audio_9939f01452.mp3'));

    // Using various "Click/Tick" sounds for consistency
    const SOUNDS = {
        blip: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',   // Same as card (Very stable)
        card: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',   // The base stable sound
        tap: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',    // Light variety of the same style
        success: 'https://assets.mixkit.co/active_storage/sfx/616/616-preview.mp3'   // A more "accomplishment" version of the click
    };

    useEffect(() => {
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.05; // Bohat halki background music

        if (!isMuted) {
            bgMusicRef.current.play().catch(e => console.log("Music blocked"));
        } else {
            bgMusicRef.current.pause();
        }
    }, [isMuted]);

    const playSound = (type) => {
        if (isMuted) return;
        try {
            const audio = new Audio(SOUNDS[type]);
            audio.volume = type === 'card' ? 0.6 : 0.4;
            audio.play().catch(e => console.error("Playback failed:", e));
        } catch (e) {
            console.error("Audio error:", e);
        }
    };

    const playBlip = () => playSound('blip');
    const playCardSound = () => playSound('card');
    const playTap = () => playSound('tap');
    const playSuccess = () => playSound('success');

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playBlip, playCardSound, playTap, playSuccess }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => useContext(SoundContext);
