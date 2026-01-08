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
import Profile from './pages/Profile';
import Login from './pages/Login';
import { Navigate } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <LanguageProvider>
      <SoundProvider>
        <Router>
          <ScrollToTop />
          <div className="app-wrapper">
            <Onboarding />
            {isAuthenticated && <Header />}
            <main>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                <Route path="/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
                <Route path="/level-path" element={<PrivateRoute><LevelPath /></PrivateRoute>} />
                <Route path="/grammar" element={<PrivateRoute><Grammar /></PrivateRoute>} />
                <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </main>
            {isAuthenticated && <Footer />}
          </div>
        </Router>
      </SoundProvider>
    </LanguageProvider>
  );
}

export default App;
