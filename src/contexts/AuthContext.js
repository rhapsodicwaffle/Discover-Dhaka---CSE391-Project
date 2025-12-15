import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const defaultBadges = [
  { id: 1, name: 'Explorer', icon: '🗺️', earned: true, description: 'Joined Discover Dhaka' },
  { id: 2, name: 'Storyteller', icon: '📖', earned: false, description: 'Share your first story' },
  { id: 3, name: 'Foodie', icon: '🍜', earned: false, description: 'Visit 5 food places' },
  { id: 4, name: 'History Buff', icon: '🏛️', earned: false, description: 'Visit 5 historical sites' },
  { id: 5, name: 'Old Town Explorer', icon: '🚶', earned: false, description: 'Complete a heritage route' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }, [user, isAuthenticated]);

  const login = (email, password) => {
    if (email && password.length >= 6) {
      const newUser = {
        email,
        name: email.split('@')[0],
        profilePicture: null,
        bio: '',
        savedPlaces: [],
        savedRoutes: [],
        myStories: [],
        xp: 0,
        badges: defaultBadges,
        isPublic: true,
        joinDate: new Date().toISOString()
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    if (name && email && password.length >= 6) {
      const newUser = {
        email,
        name,
        profilePicture: null,
        bio: '',
        savedPlaces: [],
        savedRoutes: [],
        myStories: [],
        xp: 0,
        badges: defaultBadges,
        isPublic: true,
        joinDate: new Date().toISOString()
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const savePlace = (place) => {
    setUser(prev => ({
      ...prev,
      savedPlaces: [...prev.savedPlaces, place],
      xp: prev.xp + 10
    }));
  };

  const unsavePlace = (placeId) => {
    setUser(prev => ({
      ...prev,
      savedPlaces: prev.savedPlaces.filter(p => p.id !== placeId)
    }));
  };

  const saveRoute = (route) => {
    setUser(prev => ({
      ...prev,
      savedRoutes: [...prev.savedRoutes, route],
      xp: prev.xp + 25
    }));
  };

  const addStory = (story) => {
    setUser(prev => {
      const newBadges = [...prev.badges];
      const storytellerBadge = newBadges.find(b => b.name === 'Storyteller');
      if (storytellerBadge && !storytellerBadge.earned) {
        storytellerBadge.earned = true;
      }
      
      return {
        ...prev,
        myStories: [story, ...prev.myStories],
        xp: prev.xp + 50,
        badges: newBadges
      };
    });
  };

  const earnBadge = (badgeName) => {
    setUser(prev => {
      const newBadges = [...prev.badges];
      const badge = newBadges.find(b => b.name === badgeName);
      if (badge && !badge.earned) {
        badge.earned = true;
      }
      return { ...prev, badges: newBadges };
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateProfile,
      savePlace,
      unsavePlace,
      saveRoute,
      addStory,
      earnBadge
    }}>
      {children}
    </AuthContext.Provider>
  );
};
