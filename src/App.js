import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import InteractiveMap from './components/Map/InteractiveMap';
import StoryList from './components/Stories/StoryList';
import EventList from './components/Events/EventList';
import Profile from './components/Profile/Profile';
import Forum from './components/Forum/Forum';
import ThreadDetail from './components/Forum/ThreadDetail';
import HelpFAQ from './components/Help/HelpFAQ';
import AdminDashboard from './components/Admin/AdminDashboard';
import { placesAPI } from './api/services';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="rickshaw-wheel animate-pulse"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="rickshaw-wheel animate-pulse"></div>
      </div>
    );
  }
  
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

const Home = () => {
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPlaces = async () => {
      try {
        const response = await placesAPI.getAll();
        if (response.success) {
          // Get top 6 places sorted by visitCount
          const sorted = response.data
            .filter(p => p.isApproved)
            .sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))
            .slice(0, 6);
          setPopularPlaces(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch places:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularPlaces();
  }, []);

  return (
    <div className="rickshaw-pattern" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="gradient-bg" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
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
            <Link to="/login">
              <button className="btn hover-lift" style={{ background: 'white', color: 'var(--primary)', fontSize: '16px', padding: '14px 32px' }}>
                Get Started →
              </button>
            </Link>
            <Link to="/map">
              <button className="btn btn-outline hover-glow" style={{ borderColor: 'white', color: 'white', fontSize: '16px', padding: '14px 32px', background: 'rgba(255, 255, 255, 0.1)' }}>
                🗺️ Explore Map
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Places Section */}
      <div className="container" style={{ padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>Popular Places in Dhaka</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Discover the most visited spots loved by our community</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="rickshaw-wheel animate-pulse"></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {popularPlaces.map((place, index) => (
              <div 
                key={place._id} 
                className="card hover-lift animate-scale-in" 
                style={{ overflow: 'hidden', animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={place.image} 
                  alt={place.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{place.name}</h3>
                    <span className="badge badge-primary">{place.category}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px', lineHeight: '1.6' }}>
                    {place.description.substring(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <span>⭐ {place.rating || 'N/A'}</span>
                      <span>👥 {place.visitCount || 0} visits</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link to="/map">
            <button className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
              View All Places on Map →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
              <Route path="/stories" element={<ProtectedRoute><StoriesPage /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
              <Route path="/forum/:id" element={<ProtectedRoute><ThreadDetail /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/help" element={<HelpFAQ />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
