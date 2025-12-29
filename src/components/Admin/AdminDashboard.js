import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      setLoading(true);
      const [statsRes, usersRes, eventsRes, placesRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/stats`, config),
        axios.get(`${API_BASE}/admin/users`, config),
        axios.get(`${API_BASE}/admin/pending/events`, config),
        axios.get(`${API_BASE}/admin/pending/places`, config)
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (eventsRes.data.success) setPendingEvents(eventsRes.data.data);
      if (placesRes.data.success) setPendingPlaces(placesRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveContent = async (type, id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE}/admin/approve/${type}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to approve content');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const changeUserRole = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="rickshaw-pattern" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card animate-bounce" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="rickshaw-wheel" style={{ margin: '0 auto 20px' }}></div>
          <h3>Loading Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="rickshaw-pattern" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)', padding: '40px 0', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div className="rickshaw-border"></div>
        <div className="container">
          <h1 className="animate-slide-in" style={{ color: 'white', marginBottom: '12px', fontSize: '36px', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            🎨 Admin Dashboard
          </h1>
          <p style={{ color: 'white', opacity: 0.9, fontSize: '18px' }}>
            Manage users, approve content, and monitor platform statistics
          </p>
        </div>
      </div>

      <div className="container">
        {/* Tabs */}
        <div className="rickshaw-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {['overview', 'users', 'pending', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                background: activeTab === tab 
                  ? 'linear-gradient(135deg, #FF6B35, #F7931E)' 
                  : 'white',
                color: activeTab === tab ? 'white' : 'var(--text-primary)',
                boxShadow: activeTab === tab 
                  ? '0 4px 12px rgba(255, 107, 53, 0.3)' 
                  : '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: activeTab === tab ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div className="stat-card animate-fade-in" style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)', padding: '24px', borderRadius: '12px', color: 'white', boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)' }}>
                <div className="rickshaw-wheel" style={{ marginBottom: '12px' }}></div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Users</div>
                <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.overview.totalUsers}</div>
              </div>
              <div className="stat-card animate-fade-in" style={{ background: 'linear-gradient(135deg, #4ECDC4, #44A08D)', padding: '24px', borderRadius: '12px', color: 'white', boxShadow: '0 8px 20px rgba(78, 205, 196, 0.3)', animationDelay: '0.1s' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📍</div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Places</div>
                <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.overview.totalPlaces}</div>
              </div>
              <div className="stat-card animate-fade-in" style={{ background: 'linear-gradient(135deg, #A8E6CF, #56AB91)', padding: '24px', borderRadius: '12px', color: 'white', boxShadow: '0 8px 20px rgba(168, 230, 207, 0.3)', animationDelay: '0.2s' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📖</div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Stories</div>
                <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.overview.totalStories}</div>
              </div>
              <div className="stat-card animate-fade-in" style={{ background: 'linear-gradient(135deg, #FFD93D, #F4A261)', padding: '24px', borderRadius: '12px', color: 'white', boxShadow: '0 8px 20px rgba(255, 217, 61, 0.3)', animationDelay: '0.3s' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Events</div>
                <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.overview.totalEvents}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div className="card animate-slide-up" style={{ padding: '24px', border: '3px solid #FF6B35' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Pending Events</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#FF6B35' }}>{stats.overview.pendingEvents}</div>
              </div>
              <div className="card animate-slide-up" style={{ padding: '24px', border: '3px solid #4ECDC4', animationDelay: '0.1s' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Pending Places</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4ECDC4' }}>{stats.overview.pendingPlaces}</div>
              </div>
            </div>

            <div className="card animate-fade-in" style={{ padding: '24px', animationDelay: '0.4s' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Recent Users</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.recentUsers.map((u, idx) => (
                  <div key={u._id} className="animate-slide-in" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', animationDelay: `${0.5 + idx * 0.1}s` }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '16px' }}>
                      {u.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{u.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card animate-fade-in" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>👥 All Users ({users.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #FF6B35' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>User</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>XP</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Level</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id} className="animate-slide-in" style={{ borderBottom: '1px solid #eee', animationDelay: `${idx * 0.05}s` }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' }}>
                            {u.name[0]}
                          </div>
                          <span style={{ fontWeight: '600' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={u.role}
                          onChange={(e) => changeUserRole(u._id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd', background: u.role === 'admin' ? '#FF6B35' : 'white', color: u.role === 'admin' ? 'white' : 'inherit' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#F7931E' }}>{u.xp}</td>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#4ECDC4' }}>{u.level}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="btn-danger"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div>
            <div className="card animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>⏳ Pending Events ({pendingEvents.length})</h3>
              {pendingEvents.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>No pending events</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingEvents.map((event, idx) => (
                    <div key={event._id} className="animate-slide-in" style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '2px solid #FF6B35', animationDelay: `${idx * 0.1}s` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{event.title}</h4>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            By {event.createdBy?.name} • {event.category}
                          </div>
                        </div>
                        <button
                          onClick={() => approveContent('event', event._id)}
                          className="btn"
                          style={{ background: 'linear-gradient(135deg, #4ECDC4, #44A08D)' }}
                        >
                          ✓ Approve
                        </button>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{event.description}</p>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        📅 {new Date(event.date).toLocaleDateString()} • 🕒 {event.time} • 📍 {event.venue}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card animate-fade-in" style={{ padding: '24px', animationDelay: '0.2s' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>⏳ Pending Places ({pendingPlaces.length})</h3>
              {pendingPlaces.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>No pending places</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {pendingPlaces.map((place, idx) => (
                    <div key={place._id} className="animate-scale-in" style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '2px solid #4ECDC4', animationDelay: `${idx * 0.1}s` }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{place.name}</h4>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {place.category}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                        {place.description?.substring(0, 100)}...
                      </p>
                      <button
                        onClick={() => approveContent('place', place._id)}
                        className="btn"
                        style={{ width: '100%', background: 'linear-gradient(135deg, #A8E6CF, #56AB91)' }}
                      >
                        ✓ Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="card animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
            <div className="rickshaw-wheel" style={{ margin: '0 auto 20px' }}></div>
            <h3 style={{ marginBottom: '12px' }}>Content Management</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Additional content management features coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
