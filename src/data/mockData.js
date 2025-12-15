export const mockPlaces = [
  {
    id: 1,
    name: 'Ahsan Manzil',
    category: 'History',
    description: 'The Pink Palace of Old Dhaka',
    lat: 23.7104,
    lng: 90.4074,
    rating: 4.5,
    address: 'Kumartoli, Dhaka 1100',
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 2,
    name: 'Lalbagh Fort',
    category: 'History',
    description: 'Historic Mughal fort complex',
    lat: 23.7197,
    lng: 90.3874,
    rating: 4.3,
    address: 'Lalbagh Road, Dhaka',
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 3,
    name: 'Star Kabab',
    category: 'Food',
    description: 'Famous for traditional kebabs',
    lat: 23.7291,
    lng: 90.3952,
    rating: 4.7,
    address: 'Dhanmondi, Dhaka',
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 4,
    name: 'Dhanmondi Lake',
    category: 'Nature',
    description: 'Peaceful urban lake for evening walks',
    lat: 23.7465,
    lng: 90.3742,
    rating: 4.2,
    address: 'Dhanmondi, Dhaka',
    image: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: 5,
    name: 'Liberation War Museum',
    category: 'Culture',
    description: 'Museum documenting Bangladesh independence',
    lat: 23.7392,
    lng: 90.3937,
    rating: 4.6,
    address: 'Agargaon, Dhaka',
    image: 'https://picsum.photos/400/300?random=5'
  }
];

export const mockStories = [
  {
    id: 1,
    title: 'Morning at Lalbagh Fort',
    content: 'Visited the beautiful Lalbagh Fort early morning. The architecture is stunning and the gardens are peaceful. Perfect spot for history lovers!',
    author: 'Rafiq Ahmed',
    placeId: 2,
    placeName: 'Lalbagh Fort',
    lat: 23.7197,
    lng: 90.3874,
    tags: ['history', 'photography'],
    likes: 45,
    date: '2025-12-10',
    image: 'https://picsum.photos/600/400?random=10'
  },
  {
    id: 2,
    title: 'Best Kebabs in Dhaka',
    content: 'Star Kabab never disappoints! The seekh kebabs are absolutely delicious. A must-visit for food enthusiasts.',
    author: 'Nadia Khan',
    placeId: 3,
    placeName: 'Star Kabab',
    lat: 23.7291,
    lng: 90.3952,
    tags: ['food', 'restaurant'],
    likes: 78,
    date: '2025-12-12',
    image: 'https://picsum.photos/600/400?random=11'
  },
  {
    id: 3,
    title: 'Evening Walk at Dhanmondi Lake',
    content: 'Beautiful sunset views at the lake. Locals come here to relax and exercise. Great community vibe!',
    author: 'Tahmid Rahman',
    placeId: 4,
    placeName: 'Dhanmondi Lake',
    lat: 23.7465,
    lng: 90.3742,
    tags: ['nature', 'relaxation'],
    likes: 32,
    date: '2025-12-14',
    image: 'https://picsum.photos/600/400?random=12'
  }
];

export const mockEvents = [
  {
    id: 1,
    name: 'Dhaka Art Summit 2025',
    category: 'Art',
    description: 'South Asia largest art exhibition featuring contemporary artists from Bangladesh and around the world',
    date: '2025-12-20',
    time: '10:00 AM',
    venue: 'Bangladesh Shilpakala Academy',
    lat: 23.7392,
    lng: 90.3937,
    image: 'https://picsum.photos/500/300?random=20',
    ticketLink: '#'
  },
  {
    id: 2,
    name: 'Dhaka Food Festival',
    category: 'Food',
    description: 'Taste the best street food and traditional dishes from all over Bangladesh',
    date: '2025-12-22',
    time: '5:00 PM',
    venue: 'Hatirjheel Amphitheatre',
    lat: 23.7523,
    lng: 90.4066,
    image: 'https://picsum.photos/500/300?random=21',
    ticketLink: '#'
  },
  {
    id: 3,
    name: 'Tech Meetup Dhaka',
    category: 'Tech',
    description: 'Monthly gathering of developers and tech enthusiasts. Networking and knowledge sharing',
    date: '2025-12-18',
    time: '6:30 PM',
    venue: 'BRAC Centre',
    lat: 23.7808,
    lng: 90.4106,
    image: 'https://picsum.photos/500/300?random=22',
    ticketLink: '#'
  },
  {
    id: 4,
    name: 'Bangla Rock Concert',
    category: 'Music',
    description: 'Live performance by top Bangladeshi rock bands',
    date: '2025-12-25',
    time: '7:00 PM',
    venue: 'Army Stadium',
    lat: 23.7564,
    lng: 90.3773,
    image: 'https://picsum.photos/500/300?random=23',
    ticketLink: '#'
  }
];

export const categories = ['All', 'Food', 'Culture', 'Nature', 'History', 'Nightlife', 'Art'];
export const eventCategories = ['All', 'Music', 'Art', 'Tech', 'Food', 'Sports'];
