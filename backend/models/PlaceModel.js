const supabase = require('../config/supabase');

const convertPlace = (place) => {
  if (!place) return null;
  return {
    _id: place.id,
    id: place.id,
    name: place.name,
    description: place.description,
    address: place.address,
    category: place.category,
    lat: place.latitude ? parseFloat(place.latitude) : 0,
    lng: place.longitude ? parseFloat(place.longitude) : 0,
    location: {
      lat: place.latitude ? parseFloat(place.latitude) : 0,
      lng: place.longitude ? parseFloat(place.longitude) : 0
    },
    image: place.image,
    rating: parseFloat(place.rating) || 0,
    visitCount: place.visit_count || 0,
    isApproved: place.is_approved,
    createdBy: place.created_by,
    createdAt: place.created_at,
    updatedAt: place.updated_at
  };
};

const PlaceModel = {
  findAll: async (query = {}) => {
    let supabaseQuery = supabase.from('places').select('*');
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }
    if (query.search) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%`);
    }
    
    supabaseQuery = supabaseQuery.order('visit_count', { ascending: false });
    
    const { data, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return data.map(convertPlace);
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return convertPlace(data);
  },

  create: async (placeData) => {
    const { data, error } = await supabase
      .from('places')
      .insert([{
        name: placeData.name,
        description: placeData.description,
        address: placeData.address,
        category: placeData.category,
        latitude: placeData.location?.lat,
        longitude: placeData.location?.lng,
        image: placeData.image,
        created_by: placeData.createdBy,
        is_approved: placeData.isApproved !== undefined ? placeData.isApproved : false
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertPlace(data);
  },

  update: async (id, updates) => {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.isApproved !== undefined) dbUpdates.is_approved = updates.isApproved;
    if (updates.visitCount !== undefined) dbUpdates.visit_count = updates.visitCount;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;

    const { data, error } = await supabase
      .from('places')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertPlace(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  count: async (query = {}) => {
    let supabaseQuery = supabase.from('places').select('*', { count: 'exact', head: true });
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    
    const { count, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return count;
  }
};

module.exports = PlaceModel;
