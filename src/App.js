import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Shared/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import InteractiveMap from './components/Map/InteractiveMap';
import StoryList from './components/Stories/StoryList';
import EventList from './components/Events/EventList';
import Profile from './components/Profile/Profile';
import Forum from './components/Forum/Forum';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Home = () => (
  <div className="gradient-bg" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="container" style={{ textAlign: 'center', color: 'white', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '24px', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>Discover Dhaka</h1>
      <p style={{ fontSize: '24px', marginBottom: '40px', opacity: 0.95 }}>Uncover the heart of Dhaka through stories, maps, and experiences</p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/login"><button className="btn" style={{ background: 'white', color: 'var(--primary)', fontSize: '16px', padding: '14px 32px' }}>Get Started</button></a>
        <a href="/map"><button className="btn btn-outline" style={{ borderColor: 'white', color: 'white', fontSize: '16px', padding: '14px 32px' }}>Explore Map</button></a>
      </div>
    </div>
  </div>
);

const MapPage = () => (
  <div style={{ padding: '20px 0 0 0' }}>
    <div className="container" style={{ marginBottom: '16px' }}>
      <h1>Discover Places in Dhaka</h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Explore historical sites, restaurants, and attractions</p>
    </div>
    <InteractiveMap />
  </div>
);

const StoriesPage = () => <StoryList />;

const EventsPage = () => <EventList />;

const ForumPage = () => <Forum />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/stories" element={<ProtectedRoute><StoriesPage /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
