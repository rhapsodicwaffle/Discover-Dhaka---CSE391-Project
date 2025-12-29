import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ position: 'relative' }}>
      <div className="rickshaw-border"></div>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="rickshaw-wheel" style={{ width: '40px', height: '40px', border: '3px solid var(--primary)' }}></div>
          <h2 className="gradient-text" style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Discover Dhaka
          </h2>
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/map" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500', transition: 'all 0.3s ease' }} className="nav-link">
                🗺️ Map
              </Link>
              <Link to="/stories" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500', transition: 'all 0.3s ease' }} className="nav-link">
                📖 Stories
              </Link>
              <Link to="/events" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500', transition: 'all 0.3s ease' }} className="nav-link">
                🎉 Events
              </Link>
              <Link to="/forum" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500', transition: 'all 0.3s ease' }} className="nav-link">
                💬 Forum
              </Link>
              <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500', transition: 'all 0.3s ease' }} className="nav-link">
                👤 Profile
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--rickshaw-orange)', fontWeight: '600', transition: 'all 0.3s ease' }} className="nav-link">
                  🎨 Admin
                </Link>
              )}
              <span style={{ color: 'var(--text-secondary)', padding: '8px 12px', background: '#f9f9f9', borderRadius: '8px' }}>
                Hi, {user?.name} 
              </span>
              <button onClick={handleLogout} className="btn btn-outline hover-lift" style={{ padding: '8px 16px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Login</Link>
              <Link to="/register"><button className="btn btn-primary hover-lift" style={{ padding: '8px 16px' }}>Register</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
