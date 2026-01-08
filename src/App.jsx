import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Lessons from './pages/Lessons';
import LevelPath from './pages/LevelPath';
import Game from './pages/Game';
import { SoundProvider } from './context/SoundContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

import Onboarding from './components/features/Onboarding';
import Grammar from './pages/Grammar';

function App() {
  return (
    <LanguageProvider>
      <SoundProvider>
        <Router>
          <div className="app-wrapper">
            <Onboarding />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/level-path" element={<LevelPath />} />
                <Route path="/grammar" element={<Grammar />} />
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
