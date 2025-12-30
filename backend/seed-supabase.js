require('dotenv').config();
const bcrypt = require('bcryptjs');
const UserModel = require('./models/UserModel');
const PlaceModel = require('./models/PlaceModel');
const EventModel = require('./models/EventModel');
const StoryModel = require('./models/StoryModel');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding Supabase database...');

    // Create admin user
    const admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@dhaka.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Administrator of Discover Dhaka',
      xp: 1000,
      level: 10,
      badges: [{
        id: 'founder',
        name: 'Founder',
        icon: '👑',
        description: 'Platform founder',
        dateEarned: new Date()
      }]
    });
    console.log('✅ Admin user created');

    // Create test user
    const testUser = await UserModel.create({
      name: 'Test User',
      email: 'test@dhaka.com',
      password: 'test123',
      role: 'user',
      bio: 'Test user account',
      xp: 100,
      level: 2
    });
    console.log('✅ Test user created');

    // Create places
    const places = [
      {
        name: 'Ahsan Manzil',
        description: 'The Pink Palace is a magnificent example of Indo-Saracenic Revival architecture.',
        category: 'History',
        location: {
          address: 'Kumartoli, Old Dhaka',
          lat: 23.7088,
          lng: 90.4051
        },
        image: '/images/ahsan-manzil.jpg',
        rating: 4.5,
        visitCount: 150,
        isApproved: true,
        createdBy: admin.id
      },
      {
        name: 'Lalbagh Fort',
        description: 'A 17th century Mughal fort complex standing on the banks of the Buriganga River.',
        category: 'History',
        location: {
          address: 'Lalbagh Road, Dhaka',
          lat: 23.7179,
          lng: 90.3865
        },
        image: '/images/lalbagh-fort.jpg',
        rating: 4.6,
        visitCount: 200,
        isApproved: true,
        createdBy: admin.id
      },
      {
        name: 'Star Mosque',
        description: 'A beautiful mosque known for its mosaic decorations of blue stars.',
        category: 'Religion',
        location: {
          address: 'Armanitola, Old Dhaka',
          lat: 23.7194,
          lng: 90.4091
        },
        image: '/images/star-mosque.jpg',
        rating: 4.4,
        visitCount: 120,
        isApproved: true,
        createdBy: admin.id
      },
      {
        name: 'National Martyrs Memorial',
        description: 'A monument dedicated to the memory of those who died in the Bangladesh Liberation War.',
        category: 'Landmark',
        location: {
          address: 'Savar, Dhaka',
          lat: 23.9121,
          lng: 90.2654
        },
        image: '/images/martyrs-memorial.jpg',
        rating: 4.8,
        visitCount: 300,
        isApproved: true,
        createdBy: admin.id
      },
      {
        name: 'Dhaka University',
        description: 'The oldest university in Bangladesh with beautiful British colonial architecture.',
        category: 'Education',
        location: {
          address: 'Shahbag, Dhaka',
          lat: 23.7359,
          lng: 90.3938
        },
        image: '/images/dhaka-university.jpg',
        rating: 4.3,
        visitCount: 180,
        isApproved: true,
        createdBy: admin.id
      },
      {
        name: 'Hatirjheel',
        description: 'A beautiful lake in the middle of Dhaka with walking paths and scenic views.',
        category: 'Nature',
        location: {
          address: 'Tejgaon, Dhaka',
          lat: 23.7537,
          lng: 90.4049
        },
        image: '/images/hatirjheel.jpg',
        rating: 4.2,
        visitCount: 250,
        isApproved: true,
        createdBy: admin.id
      },
      {
        name: 'Dhaka Zoo',
        description: 'Home to a wide variety of animals and birds in Mirpur.',
        category: 'Entertainment',
        location: {
          address: 'Mirpur, Dhaka',
          lat: 23.8103,
          lng: 90.3653
        },
        image: '/images/dhaka-zoo.jpg',
        rating: 3.9,
        visitCount: 500,
        isApproved: true,
        createdBy: admin.id
      },
      {
        name: 'Sadarghat',
        description: 'The busiest river port in Bangladesh on the banks of the Buriganga River.',
        category: 'Transport',
        location: {
          address: 'Sadarghat, Old Dhaka',
          lat: 23.7065,
          lng: 90.4072
        },
        image: '/images/sadarghat.jpg',
        rating: 4.0,
        visitCount: 220,
        isApproved: true,
        createdBy: admin.id
      }
    ];

    for (const place of places) {
      await PlaceModel.create(place);
    }
    console.log(`✅ Created ${places.length} places`);

    // Get the created places to get their IDs
    const createdPlaces = await PlaceModel.findAll({ isApproved: true });

    // Create events
    const events = [
      {
        title: 'Dhaka Heritage Walk',
        description: 'Join us for a guided walking tour through Old Dhaka to explore its rich heritage.',
        category: 'Tour',
        date: new Date('2025-02-15'),
        time: '09:00 AM',
        location: 'Ahsan Manzil',
        image: '/images/heritage-walk.jpg',
        attendees: [testUser.id],
        isApproved: true,
        createdBy: admin.id
      },
      {
        title: 'Photography Meetup at Lalbagh Fort',
        description: 'Photography enthusiasts gather to capture the beauty of Lalbagh Fort.',
        category: 'Photography',
        date: new Date('2025-02-20'),
        time: '04:00 PM',
        location: 'Lalbagh Fort',
        image: '/images/photo-meetup.jpg',
        attendees: [],
        isApproved: true,
        createdBy: admin.id
      },
      {
        title: 'Cultural Festival at DU',
        description: 'Annual cultural festival celebrating Bangladeshi arts and music.',
        category: 'Festival',
        date: new Date('2025-03-01'),
        time: '10:00 AM',
        location: 'Dhaka University',
        image: '/images/cultural-festival.jpg',
        attendees: [admin.id, testUser.id],
        isApproved: true,
        createdBy: testUser.id
      }
    ];

    for (const event of events) {
      await EventModel.create(event);
    }
    console.log(`✅ Created ${events.length} events`);

    // Create stories
    const stories = [
      {
        title: 'My First Visit to Old Dhaka',
        content: 'Walking through the narrow lanes of Old Dhaka was like stepping back in time. The vibrant colors, bustling markets, and historic buildings create an unforgettable experience.',
        image: '/images/old-dhaka-story.jpg',
        images: ['/images/old-dhaka-1.jpg', '/images/old-dhaka-2.jpg'],
        author: testUser.id,
        tags: ['Old Dhaka', 'Heritage', 'Culture'],
        likes: [admin.id],
        likesCount: 1,
        isApproved: true
      },
      {
        title: 'Sunset at Hatirjheel',
        content: 'The sunset view at Hatirjheel is absolutely breathtaking. The reflection of the sky on the water creates a perfect mirror image that photographers dream of.',
        image: '/images/hatirjheel-sunset.jpg',
        images: ['/images/hatirjheel-1.jpg'],
        author: admin.id,
        tags: ['Hatirjheel', 'Nature', 'Photography'],
        likes: [testUser.id],
        likesCount: 1,
        isApproved: true
      }
    ];

    for (const story of stories) {
      await StoryModel.create(story);
    }
    console.log(`✅ Created ${stories.length} stories`);

    console.log('');
    console.log('✨ Database seeded successfully!');
    console.log('');
    console.log('📝 Test Accounts:');
    console.log('   Admin: admin@dhaka.com / admin123');
    console.log('   User:  test@dhaka.com / test123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
