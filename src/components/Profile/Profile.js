import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CreateRoute from './CreateRoute';
import { authAPI } from '../../api/services';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateRoute, setShowCreateRoute] = useState(false);
  const [likedStories, setLikedStories] = useState([]);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    isPublic: user?.isPublic !== false
  });

  useEffect(() => {
    if (activeTab === 'liked') {
      fetchLikedStories();
    }
  }, [activeTab]);

  const fetchLikedStories = async () => {
    setLoadingLiked(true);
    try {
      const response = await authAPI.getLikedStories();
      setLikedStories(response.data);
    } catch (error) {
      console.error('Error fetching liked stories:', error);
    } finally {
      setLoadingLiked(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'stories', label: 'My Stories', icon: '📖', count: user?.myStories?.length || 0 },
    { id: 'liked', label: 'Liked Stories', icon: '❤️' },
    { id: 'places', label: 'Saved Places', icon: '📍', count: user?.savedPlaces?.length || 0 },
    { id: 'routes', label: 'My Routes', icon: '🗺️', count: user?.savedRoutes?.length || 0 },
    { id: 'badges', label: 'Badges', icon: '🏆', count: user?.badges?.filter(b => b.earned).length || 0 }
  ];

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const levelProgress = ((user?.xp || 0) % 100);
  const currentLevel = Math.floor((user?.xp || 0) / 100) + 1;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '60px 0 80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: '700',
                color: 'var(--primary)',
                border: '4px solid white',
                overflow: 'hidden'
              }}>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.[0]?.toUpperCase() || '?'
                )}
              </div>
              <label style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: 'var(--secondary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '3px solid white'
              }}>
                📷
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
              </label>
            </div>
            <div style={{ flex: 1, color: 'white' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{user?.name}</h1>
              <p style={{ opacity: 0.9, marginBottom: '12px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{user?.xp || 0} XP</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Level {currentLevel}</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{user?.badges?.filter(b => b.earned).length || 0}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Badges Earned</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{user?.myStories?.length || 0}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Stories Shared</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '15px'
                }}
              >
                {tab.icon} {tab.label} {tab.count !== undefined && tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '40px 20px' }}>
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '800px' }}>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Profile Information</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                    Edit Profile
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSaveProfile} className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: '8px 16px' }}>Cancel</button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                    <input
                      type="text"
                      className="input"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bio</label>
                    <textarea
                      className="input"
                      rows="3"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={editForm.isPublic}
                      onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })}
                      id="isPublic"
                    />
                    <label htmlFor="isPublic" style={{ cursor: 'pointer' }}>Make my profile public</label>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Bio</div>
                    <div>{user?.bio || 'No bio yet. Tell us about yourself!'}</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Member Since</div>
                    <div>{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Unknown'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Profile Visibility</div>
                    <div>{user?.isPublic !== false ? 'Public' : 'Private'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* XP Progress */}
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Level Progress</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Level {currentLevel}</span>
                  <span>{levelProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: 'var(--bg)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${levelProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.3s' }} />
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {100 - levelProgress} XP needed for Level {currentLevel + 1}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>My Stories ({user?.myStories?.length || 0})</h2>
            {user?.myStories?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {user.myStories.map((story, index) => (
                  <div key={index} className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{story.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>{story.content}</p>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{story.date}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No stories yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Share your first story to get started!</p>
                <a href="/stories"><button className="btn btn-primary">Create Story</button></a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Liked Stories ({likedStories.length})</h2>
            {loadingLiked ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="rickshaw-wheel animate-spin"></div>
              </div>
            ) : likedStories.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {likedStories.map((story) => (
                  <div key={story._id} className="card">
                    {story.image && (
                      <img src={story.image} alt={story.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                    )}
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{story.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                      {story.content?.substring(0, 120)}...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <img 
                        src={story.author?.profilePicture || `https://ui-avatars.com/api/?name=${story.author?.name}`} 
                        alt={story.author?.name}
                        style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{story.author?.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span>❤️ {story.likesCount || 0}</span>
                      <span>💬 {story.comments?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No liked stories yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Start exploring and like stories to see them here!</p>
                <a href="/stories"><button className="btn btn-primary">Explore Stories</button></a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'places' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Saved Places ({user?.savedPlaces?.length || 0})</h2>
            {user?.savedPlaces?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {user.savedPlaces.map(place => (
                  <div key={place.id} className="card" style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{place.name}</h3>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{place.category}</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{place.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No saved places yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Start exploring and save your favorite places!</p>
                <a href="/map"><button className="btn btn-primary">Explore Map</button></a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'routes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>My Routes ({user?.savedRoutes?.length || 0})</h2>
              <button onClick={() => setShowCreateRoute(true)} className="btn btn-primary">+ Create Route</button>
            </div>
            {user?.savedRoutes?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {user.savedRoutes.map((route, index) => (
                  <div key={index} className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{route.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>{route.description}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <span>📍 {route.places?.length || 0} places</span>
                      <span>⏱️ {route.duration || 'N/A'}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {route.places?.map((p, i) => (
                        <span key={i}>{i > 0 ? ' → ' : ''}{p.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No routes yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Create custom routes from your saved places!</p>
                <button onClick={() => setShowCreateRoute(true)} className="btn btn-primary">Create Your First Route</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Badges ({user?.badges?.filter(b => b.earned).length || 0}/{user?.badges?.length || 0})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {user?.badges?.map(badge => (
                <div
                  key={badge.id}
                  className="card"
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    opacity: badge.earned ? 1 : 0.4,
                    border: badge.earned ? '2px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{badge.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{badge.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{badge.description}</p>
                  {badge.earned && (
                    <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>✓ EARNED</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreateRoute && <CreateRoute onClose={() => setShowCreateRoute(false)} />}
    </div>
  );
};

export default Profile;
