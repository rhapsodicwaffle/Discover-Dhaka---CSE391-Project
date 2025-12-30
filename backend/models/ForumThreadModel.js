const supabase = require('../config/supabase');

const convertThread = (thread, includeAuthor = false) => {
  if (!thread) return null;
  const converted = {
    _id: thread.id,
    id: thread.id,
    title: thread.title,
    content: thread.content,
    category: thread.category,
    views: thread.views || 0,
    isPinned: thread.is_pinned,
    isApproved: thread.is_approved,
    createdAt: thread.created_at,
    updatedAt: thread.updated_at
  };

  if (includeAuthor && thread.author) {
    converted.author = {
      id: thread.author.id,
      name: thread.author.name,
      email: thread.author.email,
      profilePicture: thread.author.profile_picture
    };
  }

  return converted;
};

const ForumThreadModel = {
  findAll: async (query = {}) => {
    let supabaseQuery = supabase
      .from('forum_threads')
      .select(`
        *,
        author:users!forum_threads_author_id_fkey(id, name, profile_picture)
      `);
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }
    
    supabaseQuery = supabaseQuery
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });
    
    const { data, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return data.map(t => convertThread(t, true));
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('forum_threads')
      .select(`
        *,
        author:users!forum_threads_author_id_fkey(id, name, profile_picture)
      `)
      .eq('id', id)
      .single();
    
    if (error) return null;
    return convertThread(data, true);
  },

  create: async (threadData) => {
    const { data, error } = await supabase
      .from('forum_threads')
      .insert([{
        title: threadData.title,
        content: threadData.content,
        category: threadData.category,
        author_id: threadData.author,
        is_approved: threadData.isApproved !== undefined ? threadData.isApproved : false
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertThread(data);
  },

  update: async (id, updates) => {
    const dbUpdates = {};
    if (updates.isApproved !== undefined) dbUpdates.is_approved = updates.isApproved;
    if (updates.views !== undefined) dbUpdates.views = updates.views;
    if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;

    const { data, error } = await supabase
      .from('forum_threads')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertThread(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('forum_threads')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  count: async (query = {}) => {
    let supabaseQuery = supabase.from('forum_threads').select('*', { count: 'exact', head: true });
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    
    const { count, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return count;
  }
};

module.exports = ForumThreadModel;
