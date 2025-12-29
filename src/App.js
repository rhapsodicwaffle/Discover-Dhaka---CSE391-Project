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
import AdminDashboard from './components/Admin/AdminDashboard';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

const Home = () => (
  <div className="gradient-bg rickshaw-pattern" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    <div className="rickshaw-border"></div>
    <div className="container" style={{ textAlign: 'center', color: 'white', padding: '60px 20px', position: 'relative', zIndex: 1 }}>
      <div className="rickshaw-wheel animate-pulse" style={{ margin: '0 auto 32px' }}></div>
      <h1 className="animate-fade-in" style={{ fontSize: '56px', fontWeight: '800', marginBottom: '24px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        🛺 Discover Dhaka
      </h1>
      <p className="animate-fade-in" style={{ fontSize: '24px', marginBottom: '40px', opacity: 0.95, animationDelay: '0.2s' }}>
        Uncover the heart of Dhaka through stories, maps, and experiences
      </p>
      <div className="animate-slide-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.4s' }}>
        <a href="/login">
          <button className="btn hover-lift" style={{ background: 'white', color: 'var(--primary)', fontSize: '16px', padding: '14px 32px' }}>
            Get Started →
          </button>
        </a>
        <a href="/map">
          <button className="btn btn-outline hover-glow" style={{ borderColor: 'white', color: 'white', fontSize: '16px', padding: '14px 32px', background: 'rgba(255, 255, 255, 0.1)' }}>
            🗺️ Explore Map
          </button>
        </a>
      </div>
    </div>
  </div>
);

const MapPage = () => (
  <div className="rickshaw-pattern" style={{ padding: '20px 0 0 0', minHeight: '100vh' }}>
    <div className="container animate-fade-in" style={{ marginBottom: '16px' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>🗺️</span> Discover Places in Dhaka
      </h1>
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
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} 
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />/>
            <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
