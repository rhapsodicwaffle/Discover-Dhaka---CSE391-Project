const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

// Helper to convert Supabase rows to match previous MongoDB structure
const convertUser = (user) => {
  if (!user) return null;
  return {
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    profilePicture: user.profile_picture,
    bio: user.bio,
    xp: user.xp,
    level: user.level,
    isPublic: user.is_public,
    savedPlaces: user.saved_places || [],
    savedRoutes: user.saved_routes || [],
    badges: user.badges || [],
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
};

const UserModel = {
  // Find user by email
  findByEmail: async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return convertUser(data);
  },

  // Find user by ID
  findById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return convertUser(data);
  },

  // Create new user
  create: async (userData) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const insertData = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user'
    };

    // Add optional fields if provided
    if (userData.bio !== undefined) insertData.bio = userData.bio;
    if (userData.xp !== undefined) insertData.xp = userData.xp;
    if (userData.level !== undefined) insertData.level = userData.level;
    if (userData.profilePicture !== undefined) insertData.profile_picture = userData.profilePicture;
    if (userData.badges !== undefined) insertData.badges = userData.badges;
    if (userData.isPublic !== undefined) insertData.is_public = userData.isPublic;
    if (userData.savedPlaces !== undefined) insertData.saved_places = userData.savedPlaces;
    if (userData.savedRoutes !== undefined) insertData.saved_routes = userData.savedRoutes;

    const { data, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertUser(data);
  },

  // Update user
  update: async (id, updates) => {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.profilePicture !== undefined) dbUpdates.profile_picture = updates.profilePicture;
    if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.savedPlaces !== undefined) dbUpdates.saved_places = updates.savedPlaces;
    if (updates.savedRoutes !== undefined) dbUpdates.saved_routes = updates.savedRoutes;
    if (updates.badges !== undefined) dbUpdates.badges = updates.badges;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertUser(data);
  },

  // Compare password
  comparePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Get all users (for admin)
  findAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(convertUser);
  },

  // Delete user
  deleteById: async (id) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  // Count users
  count: async () => {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return count;
  }
};

module.exports = UserModel;
