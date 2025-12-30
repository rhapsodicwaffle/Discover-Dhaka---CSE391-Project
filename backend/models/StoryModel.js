const supabase = require('../config/supabase');

const convertStory = (story, includeAuthor = false) => {
  if (!story) return null;
  const converted = {
    _id: story.id,
    id: story.id,
    title: story.title,
    content: story.content,
    image: story.image,
    tags: story.tags || [],
    place: story.place_id,
    likes: story.likes || [],
    likesCount: story.likes_count || 0,
    isApproved: story.is_approved,
    createdAt: story.created_at,
    updatedAt: story.updated_at
  };

  if (includeAuthor && story.author) {
    converted.author = {
      id: story.author.id,
      name: story.author.name,
      email: story.author.email,
      profilePicture: story.author.profile_picture
    };
  }

  return converted;
};

const StoryModel = {
  findAll: async (query = {}) => {
    let supabaseQuery = supabase
      .from('stories')
      .select(`
        *,
        author:users!stories_author_id_fkey(id, name, email, profile_picture)
      `);
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    if (query.tag) {
      supabaseQuery = supabaseQuery.contains('tags', [query.tag]);
    }
    
    supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    
    const { data, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return data.map(s => convertStory(s, true));
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        author:users!stories_author_id_fkey(id, name, profile_picture)
      `)
      .eq('id', id)
      .single();
    
    if (error) return null;
    return convertStory(data, true);
  },

  create: async (storyData) => {
    const { data, error } = await supabase
      .from('stories')
      .insert([{
        title: storyData.title,
        content: storyData.content,
        image: storyData.image,
        tags: storyData.tags || [],
        place_id: storyData.place,
        author_id: storyData.author,
        is_approved: storyData.isApproved !== undefined ? storyData.isApproved : false
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertStory(data);
  },

  update: async (id, updates) => {
    const dbUpdates = {};
    if (updates.isApproved !== undefined) dbUpdates.is_approved = updates.isApproved;
    if (updates.likes !== undefined) dbUpdates.likes = updates.likes;
    if (updates.likesCount !== undefined) dbUpdates.likes_count = updates.likesCount;

    const { data, error } = await supabase
      .from('stories')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertStory(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  count: async (query = {}) => {
    let supabaseQuery = supabase.from('stories').select('*', { count: 'exact', head: true });
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    
    const { count, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return count;
  }
};

module.exports = StoryModel;
