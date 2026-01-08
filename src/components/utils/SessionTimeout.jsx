import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTimeout = ({ timeoutInMinutes = 30 }) => {
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        // Clear other session data if any
        window.location.reload(); // Force reload to trigger App logic
    };

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Don't set timer if not authenticated
        if (localStorage.getItem('isAuthenticated') !== 'true') return;

        timeoutRef.current = setTimeout(() => {
            console.log("Inactivity timeout reached. Logging out...");
            logout();
        }, timeoutInMinutes * 60 * 1000);
    };

    useEffect(() => {
        // Events to monitor for activity
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart'
        ];

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Initial timer start
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null; // This component doesn't render anything
};

export default SessionTimeout;
