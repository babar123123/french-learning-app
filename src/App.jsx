import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Lessons from './pages/Lessons';
import Game from './pages/Game';
import { SoundProvider } from './context/SoundContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <SoundProvider>
        <Router>
          <div className="app-wrapper">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/game" element={<Game />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SoundProvider>
    </LanguageProvider>
  );
}

export default App;
