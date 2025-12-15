Discover Dhaka

An immersive web platform that allows users to explore the city of Dhaka through interactive maps, community stories, and local events. The platform combines geospatial mapping, crowdsourced storytelling, and event discovery to help both locals and travelers uncover Dhaka's hidden gems, history, and everyday culture.


How to Build and Run the App

Prerequisites:
- Node.js (version 14 or higher)
- npm (comes with Node.js)

Installation Steps:

1. Clone or download the project to your computer

2. Open a terminal in the project directory

3. Install dependencies:
   npm install

4. Start the development server:
   npm start

5. The app will open in your browser at http://localhost:3000

6. To build for production:
   npm run build

This creates an optimized production build in the build folder ready for deployment.


## Login Information

The app uses mock authentication for demonstration purposes:
- Email: Any valid email format (example: user@dhaka.com)
- Password: Any password with at least 6 characters (example: password123)


## Currently Implemented Features

1. Interactive Smart Map
   - Dynamic map markers for landmarks, restaurants, and attractions
   - Category filters (Food, Culture, Nature, History, Nightlife, Art)
   - Search functionality with live filtering
   - Click markers to view place details (name, description, image, rating)
   - Save/bookmark places to your profile
   - Built with Leaflet and React-Leaflet

2. Story Mode (User-Generated Content)
   - Users can share personal experiences and travel stories
   - Each story includes title, content, location, tags, and date
   - Like functionality for stories
   - Filter stories by tags
   - Stories automatically tracked in user profile
   - Create new stories through modal form

3. Event Explorer
   - Browse curated local events
   - Event details include name, category, date, time, venue
   - Category filters (Music, Art, Tech, Food, Sports)
   - Add to Calendar button
   - Ticket links for events

4. User Accounts and Profiles
   - Login and Registration system
   - Comprehensive profile page with multiple tabs:
     - Overview: Profile information, bio, member since date
     - My Stories: View all your shared stories
     - Saved Places: All bookmarked locations
     - My Routes: Custom routes you have created
     - Badges: Achievement badges and progress
   - Profile picture upload
   - Public/Private profile toggle
   - Edit profile functionality

5. XP and Badge System
   - Earn experience points for activities:
     - Save a place: 10 XP
     - Create a story: 50 XP
     - Create a route: 25 XP
   - Level progression (every 100 XP = 1 level)
   - 5 achievement badges:
     - Explorer: Earned on joining
     - Storyteller: Share your first story
     - Foodie: Visit 5 food places
     - History Buff: Visit 5 historical sites
     - Old Town Explorer: Complete a heritage route

6. Custom Routes
   - Create personalized itineraries from saved places
   - Select 2 or more places to build a route
   - Add route name and description
   - View all created routes in profile
   - Estimated duration calculation

7. Navigation and UI
   - Responsive navbar with all main sections
   - Protected routes (require authentication)
   - Modern gradient design with Dhaka-inspired colors
   - Smooth transitions and animations
   - Mobile-friendly responsive layout

8. Data Persistence
   - User data saved to localStorage
   - Profile information persists across sessions
   - Saved places and routes retained after logout/login


## Features Yet to Be Implemented

1. Interactive Smart Map Enhancements
   - Get Directions button (Google Maps API integration)
   - User ratings and reviews system
   - Map clustering for multiple nearby pins
   - Heatmap view for popular locations

2. Story Mode Enhancements
   - Comment system for stories
   - Add to my route button from stories
   - Stories displayed as map markers
   - Upload multiple images (currently placeholder)

3. Event Explorer Enhancements
   - User-submitted events
   - Map view for event locations
   - Admin moderation for submissions
   - Calendar integration (iCal/Google Calendar)

4. Discover Routes (Algorithmic)
   - Pre-generated recommended routes
   - Routes based on user interests
   - Shortest path optimization
   - Examples: Historic Old Dhaka Route, Foodie's Trail
   - Google Directions API integration
   - Estimated time calculations

5. Admin Dashboard
   - User management panel
   - Approve/reject stories and events
   - Analytics dashboard with charts
   - Most visited areas tracking
   - User engagement metrics
   - Add/edit/delete places

6. User Account Enhancements
   - JWT or OAuth authentication (Google login)
   - Badge unlock automation based on activity
   - Social profile features
   - Follow other users
   - Real backend integration

7. Dhaka Heritage Mode
   - Curated heritage tours by admins
   - Narrated historical routes
   - Image sliders for immersive storytelling
   - Optional 360-degree panorama views
   - Audio guides

8. Community Zone
   - Discussion forum
   - Topics: food, travel hacks, photography spots
   - Thread organization by category
   - Admin moderation

9. UI/UX Enhancements
   - Light and dark mode toggle
   - Rickshaw art-inspired design elements
   - More animations and transitions
   - Accessibility improvements

10. Backend Integration
    - Real database (MongoDB/PostgreSQL)
    - RESTful API or GraphQL
    - Secure authentication
    - File upload for images
    - Real-time updates


## Technology Stack

- React 19.2.3
- React Router DOM 7.10.1
- Leaflet 1.9.4 (mapping library)
- React-Leaflet 5.0.0
- CSS custom properties for theming
- LocalStorage for data persistence


## Project Structure

src/
  components/
    Auth/ - Login and Registration
    Events/ - Event cards and list
    Map/ - Interactive map component
    Profile/ - User profile and routes
    Shared/ - Navbar and common components
    Stories/ - Story cards, list, and creation
  contexts/
    AuthContext.js - User authentication and state
  data/
    mockData.js - Sample places, stories, and events
  App.js - Main routing
  index.js - Entry point
  index.css - Global styles