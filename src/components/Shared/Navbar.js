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
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 className="gradient-text" style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Discover Dhaka</h2>
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/map" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Map</Link>
              <Link to="/stories" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Stories</Link>
              <Link to="/events" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Events</Link>
              <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Profile</Link>
              <span style={{ color: 'var(--text-secondary)' }}>Hi, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Login</Link>
              <Link to="/register"><button className="btn btn-primary" style={{ padding: '8px 16px' }}>Register</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
