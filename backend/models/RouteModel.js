const supabase = require('../config/supabase');

// Convert route from database format to API format
const convertRoute = (route) => {
  if (!route) return null;
  
  return {
    id: route.id,
    name: route.name,
    description: route.description,
    type: route.type,
    duration: route.duration,
    distance: route.distance,
    waypoints: route.waypoints || [],
    places: route.places || [],
    isPublic: route.is_public,
    user: route.user_id,
    createdAt: route.created_at,
    updatedAt: route.updated_at
  };
};

class RouteModel {
  static async findAll(query = {}) {
    let dbQuery = supabase
      .from('routes')
      .select('*, user:users!routes_user_id_fkey(id, name, profile_picture)');
    
    if (query.type) {
      dbQuery = dbQuery.eq('type', query.type);
    }
    
    if (query.isPublic !== undefined) {
      dbQuery = dbQuery.eq('is_public', query.isPublic);
    }
    
    if (query.user) {
      dbQuery = dbQuery.eq('user_id', query.user);
    }
    
    const { data, error } = await dbQuery.order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    return data.map(route => ({
      ...convertRoute(route),
      user: route.user ? {
        id: route.user.id,
        name: route.user.name,
        profilePicture: route.user.profile_picture
      } : null
    }));
  }
  
  static async findById(id) {
    const { data, error } = await supabase
      .from('routes')
      .select('*, user:users!routes_user_id_fkey(id, name, profile_picture)')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return {
      ...convertRoute(data),
      user: data.user ? {
        id: data.user.id,
        name: data.user.name,
        profilePicture: data.user.profile_picture
      } : null
    };
  }
  
  static async create(routeData) {
    const { data, error } = await supabase
      .from('routes')
      .insert({
        name: routeData.name,
        description: routeData.description,
        type: routeData.type,
        duration: routeData.duration,
        distance: routeData.distance,
        waypoints: routeData.waypoints || [],
        places: routeData.places || [],
        is_public: routeData.isPublic !== undefined ? routeData.isPublic : true,
        user_id: routeData.user
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return convertRoute(data);
  }
  
  static async update(id, updates) {
    const dbUpdates = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.distance !== undefined) dbUpdates.distance = updates.distance;
    if (updates.waypoints !== undefined) dbUpdates.waypoints = updates.waypoints;
    if (updates.places !== undefined) dbUpdates.places = updates.places;
    if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;
    
    const { data, error } = await supabase
      .from('routes')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return convertRoute(data);
  }
  
  static async delete(id) {
    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    return true;
  }
  
  static async count(query = {}) {
    let dbQuery = supabase
      .from('routes')
      .select('id', { count: 'exact', head: true });
    
    if (query.user) {
      dbQuery = dbQuery.eq('user_id', query.user);
    }
    
    if (query.isPublic !== undefined) {
      dbQuery = dbQuery.eq('is_public', query.isPublic);
    }
    
    const { count, error } = await dbQuery;
    
    if (error) throw new Error(error.message);
    
    return count || 0;
  }
}

module.exports = RouteModel;
