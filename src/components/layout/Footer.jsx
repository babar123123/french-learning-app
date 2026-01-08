import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            borderTop: 'var(--glass-border)',
            padding: '40px 0',
            marginTop: 'auto',
            textAlign: 'center',
            color: 'var(--text-secondary)'
        }}>
            <div className="container">
                <p>© 2026 Lumière AI. Master French with elegance.</p>
            </div>
        </footer>
    );
};

export default Footer;
