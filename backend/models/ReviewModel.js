const supabase = require('../config/supabase');

// Convert review from database format to API format
const convertReview = (review) => {
  if (!review) return null;
  
  return {
    id: review.id,
    place: review.place_id,
    user: review.user_id,
    rating: review.rating,
    comment: review.comment,
    images: review.images || [],
    createdAt: review.created_at,
    updatedAt: review.updated_at
  };
};

class ReviewModel {
  static async findAll(query = {}) {
    let dbQuery = supabase
      .from('reviews')
      .select('*, user:users!reviews_user_id_fkey(id, name, profile_picture)');
    
    if (query.place) {
      dbQuery = dbQuery.eq('place_id', query.place);
    }
    
    if (query.user) {
      dbQuery = dbQuery.eq('user_id', query.user);
    }
    
    const { data, error } = await dbQuery.order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    return data.map(review => ({
      ...convertReview(review),
      user: review.user ? {
        id: review.user.id,
        name: review.user.name,
        profilePicture: review.user.profile_picture
      } : null
    }));
  }
  
  static async findById(id) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:users!reviews_user_id_fkey(id, name, profile_picture)')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return {
      ...convertReview(data),
      user: data.user ? {
        id: data.user.id,
        name: data.user.name,
        profilePicture: data.user.profile_picture
      } : null
    };
  }
  
  static async findOne(query) {
    let dbQuery = supabase
      .from('reviews')
      .select('*');
    
    if (query.place) {
      dbQuery = dbQuery.eq('place_id', query.place);
    }
    
    if (query.user) {
      dbQuery = dbQuery.eq('user_id', query.user);
    }
    
    const { data, error } = await dbQuery.single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return convertReview(data);
  }
  
  static async create(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        place_id: reviewData.place,
        user_id: reviewData.user,
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images || []
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return convertReview(data);
  }
  
  static async update(id, updates) {
    const dbUpdates = {};
    
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.comment !== undefined) dbUpdates.comment = updates.comment;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    
    const { data, error } = await supabase
      .from('reviews')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return convertReview(data);
  }
  
  static async delete(id) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    return true;
  }
  
  static async count(query = {}) {
    let dbQuery = supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true });
    
    if (query.user) {
      dbQuery = dbQuery.eq('user_id', query.user);
    }
    
    if (query.place) {
      dbQuery = dbQuery.eq('place_id', query.place);
    }
    
    const { count, error } = await dbQuery;
    
    if (error) throw new Error(error.message);
    
    return count || 0;
  }
}

module.exports = ReviewModel;
