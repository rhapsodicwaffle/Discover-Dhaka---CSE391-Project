const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('./config/database');
const User = require('./models/User');
const Place = require('./models/Place');
const Story = require('./models/Story');
const Event = require('./models/Event');

// Import mock data from frontend
const mockPlaces = [
  {
    id: 1,
    name: "Lalbagh Fort",
    lat: 23.7182,
    lng: 90.3868,
    category: "History",
    rating: 4.5,
    address: "Lalbagh Road, Dhaka 1211",
    image: "https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=500",
    description: "A 17th century Mughal fort complex that stands as a symbol of the city's historical heritage.",
    isApproved: true
  },
  {
    id: 2,
    name: "Ahsan Manzil",
    lat: 23.7089,
    lng: 90.4063,
    category: "History",
    rating: 4.3,
    address: "Kumartoli, Dhaka 1100",
    image: "https://images.unsplash.com/photo-1598960506275-1b7fc6cf0648?w=500",
    description: "The Pink Palace - former residential palace of the Nawab of Dhaka.",
    isApproved: true
  },
  {
    id: 3,
    name: "Star Mosque",
    lat: 23.7114,
    lng: 90.3992,
    category: "Culture",
    rating: 4.4,
    address: "Armanitola, Dhaka 1100",
    image: "https://images.unsplash.com/photo-1564769662454-4dd8f9c95025?w=500",
    description: "Beautiful mosque adorned with Japanese and English china tiles.",
    isApproved: true
  },
  {
    id: 4,
    name: "Dhaka University",
    lat: 23.7311,
    lng: 90.3969,
    category: "Culture",
    rating: 4.2,
    address: "Dhaka University Road, Dhaka 1000",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=500",
    description: "Historic university campus with colonial architecture.",
    isApproved: true
  },
  {
    id: 5,
    name: "Sadarghat River Port",
    lat: 23.7064,
    lng: 90.4100,
    category: "Nature",
    rating: 4.0,
    address: "Sadarghat, Dhaka 1100",
    image: "https://images.unsplash.com/photo-1564769625905-4548637f14ea?w=500",
    description: "One of the largest river ports in the world, bustling with activity.",
    isApproved: true
  },
  {
    id: 6,
    name: "Hatir Jheel",
    lat: 23.7540,
    lng: 90.4043,
    category: "Nature",
    rating: 4.1,
    address: "Hatirjheel, Dhaka 1205",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    description: "Beautiful lake with walking paths and recreational facilities.",
    isApproved: true
  },
  {
    id: 7,
    name: "Bangladesh National Museum",
    lat: 23.7384,
    lng: 90.3943,
    category: "Culture",
    rating: 4.3,
    address: "Shahbag, Dhaka 1000",
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=500",
    description: "Premier museum showcasing Bangladesh's rich cultural heritage.",
    isApproved: true
  },
  {
    id: 8,
    name: "Kacchi Bhai",
    lat: 23.8103,
    lng: 90.4125,
    category: "Food",
    rating: 4.6,
    address: "Banani, Dhaka 1213",
    image: "https://images.unsplash.com/photo-1585937421612-70e008a2bf0f?w=500",
    description: "Famous restaurant serving authentic Bangladeshi biryani.",
    isApproved: true
  }
];

const mockEvents = [
  {
    name: "Pohela Boishakh Celebration",
    title: "Pohela Boishakh Celebration",
    description: "Traditional Bengali New Year celebration with cultural programs and festivities.",
    category: "Other",
    date: new Date('2024-04-14'),
    time: "08:00 AM",
    venue: "Ramna Park",
    lat: 23.7384,
    lng: 90.3943,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500",
    isApproved: true
  },
  {
    name: "Dhaka Art Summit",
    title: "Dhaka Art Summit",
    description: "International art exhibition featuring contemporary artists from South Asia.",
    category: "Art",
    date: new Date('2024-02-15'),
    time: "10:00 AM",
    venue: "Bangladesh Shilpakala Academy",
    lat: 23.7391,
    lng: 90.3937,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500",
    isApproved: true
  },
  {
    name: "Food Festival Dhaka",
    title: "Food Festival Dhaka",
    description: "Annual food festival showcasing the best of Bangladeshi cuisine.",
    category: "Food",
    date: new Date('2024-03-20'),
    time: "12:00 PM",
    venue: "Army Stadium",
    lat: 23.7644,
    lng: 90.3786,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
    isApproved: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Place.deleteMany({});
    await Story.deleteMany({});
    await Event.deleteMany({});
    
    console.log('Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@discoverdhaka.com',
      password: 'admin123',
      role: 'admin',
      xp: 1000,
      level: 10,
      badges: [
        { id: 1, name: 'Explorer', icon: '🗺️', earned: true, description: 'Joined Discover Dhaka', earnedAt: new Date() },
        { id: 2, name: 'Storyteller', icon: '📖', earned: true, description: 'Share your first story', earnedAt: new Date() },
        { id: 3, name: 'Foodie', icon: '🍜', earned: true, description: 'Visit 5 food places', earnedAt: new Date() }
      ]
    });
    
    console.log('Creating test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'test123',
      xp: 250,
      level: 3,
      badges: [
        { id: 1, name: 'Explorer', icon: '🗺️', earned: true, description: 'Joined Discover Dhaka', earnedAt: new Date() },
        { id: 2, name: 'Storyteller', icon: '📖', earned: false, description: 'Share your first story' }
      ]
    });
    
    console.log('Seeding places...');
    const places = await Place.insertMany(mockPlaces.map(p => ({
      ...p,
      _id: undefined,
      id: undefined
    })));
    
    console.log('Seeding events...');
    const events = await Event.insertMany(mockEvents.map(e => ({
      ...e,
      createdBy: adminUser._id
    })));
    
    console.log('Creating sample stories...');
    const stories = await Story.create([
      {
        author: testUser._id,
        title: "My Visit to Lalbagh Fort",
        content: "An amazing experience exploring the historic Mughal architecture. The fort is well-preserved and the gardens are beautiful.",
        place: places[0]._id,
        placeName: "Lalbagh Fort",
        images: ["https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=500"],
        tags: ["history", "architecture"],
        likes: [adminUser._id],
        likesCount: 1,
        comments: [
          {
            user: adminUser._id,
            content: "Great story! I love this place too.",
            createdAt: new Date()
          }
        ]
      },
      {
        author: adminUser._id,
        title: "Sadarghat: The Heart of Dhaka",
        content: "The river port is a bustling hub of activity. Watching the boats and ferries is mesmerizing. A must-visit for understanding Dhaka's connection to the river.",
        place: places[4]._id,
        placeName: "Sadarghat River Port",
        images: ["https://images.unsplash.com/photo-1564769625905-4548637f14ea?w=500"],
        tags: ["river", "culture", "photography"],
        likesCount: 0
      }
    ]);
    
    // Update users with saved places
    testUser.savedPlaces = [places[0]._id, places[2]._id, places[5]._id];
    await testUser.save();
    
    adminUser.savedPlaces = [places[1]._id, places[3]._id, places[6]._id];
    await adminUser.save();
    
    console.log('✅ Database seeded successfully!');
    console.log(`Created ${places.length} places`);
    console.log(`Created ${events.length} events`);
    console.log(`Created ${stories.length} stories`);
    console.log(`Created 2 users (admin@discoverdhaka.com / admin123, test@test.com / test123)`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
