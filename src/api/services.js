import apiClient from './client';

export const authAPI = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
  
  uploadProfilePicture: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getLikedStories: async () => {
    const response = await apiClient.get('/auth/liked-stories');
    return response.data;
  }
};

export const placesAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/places', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/places/${id}`);
    return response.data;
  },
  
  create: async (placeData) => {
    const formData = new FormData();
    Object.keys(placeData).forEach(key => {
      if (key === 'images' && Array.isArray(placeData[key])) {
        placeData[key].forEach(file => formData.append('images', file));
      } else {
        formData.append(key, placeData[key]);
      }
    });
    
    const response = await apiClient.post('/places', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getHeatmapData: async () => {
    const response = await apiClient.get('/places/heatmap/data');
    return response.data;
  }
};

export const storiesAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/stories', { params });
    return response.data;
  },
  
  create: async (storyData) => {
    const formData = new FormData();
    Object.keys(storyData).forEach(key => {
      if (key === 'images' && Array.isArray(storyData[key])) {
        storyData[key].forEach(file => formData.append('images', file));
      } else if (key === 'tags' && Array.isArray(storyData[key])) {
        formData.append(key, JSON.stringify(storyData[key]));
      } else {
        formData.append(key, storyData[key]);
      }
    });
    
    const response = await apiClient.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  like: async (id) => {
    const response = await apiClient.post(`/stories/${id}/like`);
    return response.data;
  },
  
  addComment: async (id, content) => {
    const response = await apiClient.post(`/stories/${id}/comment`, { content });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/stories/${id}`);
    return response.data;
  }
};

export const eventsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },
  
  attend: async (id) => {
    const response = await apiClient.post(`/events/${id}/attend`);
    return response.data;
  }
};

export const routesAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/routes', { params });
    return response.data;
  },
  
  getUserRoutes: async (userId) => {
    const response = await apiClient.get(`/routes/user/${userId}`);
    return response.data;
  },
  
  create: async (routeData) => {
    const response = await apiClient.post('/routes', routeData);
    return response.data;
  },
  
  generateRoute: async (type) => {
    const response = await apiClient.get(`/routes/generate/${type}`);
    return response.data;
  }
};

export const reviewsAPI = {
  getByPlace: async (placeId) => {
    const response = await apiClient.get(`/reviews/place/${placeId}`);
    return response.data;
  },
  
  create: async (reviewData) => {
    const formData = new FormData();
    Object.keys(reviewData).forEach(key => {
      if (key === 'images' && Array.isArray(reviewData[key])) {
        reviewData[key].forEach(file => formData.append('images', file));
      } else {
        formData.append(key, reviewData[key]);
      }
    });
    
    const response = await apiClient.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const forumAPI = {
  getThreads: async (params = {}) => {
    const response = await apiClient.get('/forum', { params });
    return response.data;
  },
  
  getThread: async (id) => {
    const response = await apiClient.get(`/forum/${id}`);
    return response.data;
  },

  getThreadById: async (id) => {
    const response = await apiClient.get(`/forum/${id}`);
    return response.data;
  },
  
  createThread: async (threadData) => {
    const response = await apiClient.post('/forum', threadData);
    return response.data;
  },
  
  replyToThread: async (id, replyData) => {
    const response = await apiClient.post(`/forum/${id}/reply`, replyData);
    return response.data;
  },

  upvoteThread: async (id) => {
    const response = await apiClient.post(`/forum/${id}/upvote`);
    return response.data;
  },

  downvoteThread: async (id) => {
    const response = await apiClient.post(`/forum/${id}/downvote`);
    return response.data;
  },

  upvoteReply: async (replyId) => {
    const response = await apiClient.post(`/forum/reply/${replyId}/upvote`);
    return response.data;
  },

  downvoteReply: async (replyId) => {
    const response = await apiClient.post(`/forum/reply/${replyId}/downvote`);
    return response.data;
  }
};

export const usersAPI = {
  getProfile: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },
  
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
