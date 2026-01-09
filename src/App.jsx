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

import Grammar from './pages/Grammar';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import { Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';
import SessionTimeout from './components/utils/SessionTimeout';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();
  const isWelcomePage = location.pathname === '/welcome';

  return (
    <div className="app-wrapper">
      {isAuthenticated && !isWelcomePage && <Header />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
          <Route path="/level-path" element={<PrivateRoute><LevelPath /></PrivateRoute>} />
          <Route path="/grammar" element={<PrivateRoute><Grammar /></PrivateRoute>} />
          <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>
      {isAuthenticated && !isWelcomePage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <SoundProvider>
        <Router>
          <ScrollToTop />
          <SessionTimeout timeoutInMinutes={5} />
          <AppContent />
        </Router>
      </SoundProvider>
    </LanguageProvider>
  );
}

export default App;
