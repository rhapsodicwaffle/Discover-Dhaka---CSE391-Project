const supabase = require('../config/supabase');

const convertEvent = (event, includeCreatedBy = false) => {
  if (!event) return null;
  const converted = {
    _id: event.id,
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.date,
    time: event.time,
    venue: event.venue,
    ticketLink: event.ticket_link,
    image: event.image,
    isApproved: event.is_approved,
    attendees: event.attendees || [],
    createdAt: event.created_at,
    updatedAt: event.updated_at
  };

  if (includeCreatedBy && event.createdBy) {
    converted.createdBy = {
      id: event.createdBy.id,
      name: event.createdBy.name,
      email: event.createdBy.email,
      profilePicture: event.createdBy.profile_picture
    };
  }

  return converted;
};

const EventModel = {
  findAll: async (query = {}) => {
    let supabaseQuery = supabase
      .from('events')
      .select(`
        *,
        createdBy:users!events_created_by_fkey(id, name, email, profile_picture)
      `);
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }
    
    supabaseQuery = supabaseQuery.order('date', { ascending: false });
    
    const { data, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return data.map(e => convertEvent(e, true));
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        createdBy:users!events_created_by_fkey(id, name, profile_picture)
      `)
      .eq('id', id)
      .single();
    
    if (error) return null;
    return convertEvent(data, true);
  },

  create: async (eventData) => {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        date: eventData.date,
        time: eventData.time,
        venue: eventData.venue,
        ticket_link: eventData.ticketLink,
        image: eventData.image,
        created_by: eventData.createdBy,
        is_approved: eventData.isApproved !== undefined ? eventData.isApproved : false
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertEvent(data);
  },

  update: async (id, updates) => {
    const dbUpdates = {};
    if (updates.isApproved !== undefined) dbUpdates.is_approved = updates.isApproved;
    if (updates.attendees !== undefined) dbUpdates.attendees = updates.attendees;

    const { data, error } = await supabase
      .from('events')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return convertEvent(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  count: async (query = {}) => {
    let supabaseQuery = supabase.from('events').select('*', { count: 'exact', head: true });
    
    if (query.isApproved !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_approved', query.isApproved);
    }
    
    const { count, error } = await supabaseQuery;
    if (error) throw new Error(error.message);
    return count;
  }
};

module.exports = EventModel;
