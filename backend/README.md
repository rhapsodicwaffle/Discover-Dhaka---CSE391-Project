# Discover Dhaka Backend

Node.js + Express + MongoDB backend API for Discover Dhaka.

## Prerequisites

- Node.js 14+ and npm
- MongoDB 4.4+ (Community Edition)

## MongoDB Installation

### Windows
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service (recommended)
5. Alternatively, install via Chocolatey: `choco install mongodb`

### Start MongoDB
- If installed as a service, it starts automatically
- Manual start: Run `mongod` in terminal
- Verify: MongoDB runs on `mongodb://localhost:27017`

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `.env` with your settings:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/discover-dhaka
     JWT_SECRET=your-secret-key-change-this
     NODE_ENV=development
     ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```
   This creates:
   - Admin user: `admin@discoverdhaka.com` / `admin123`
   - Test user: `test@test.com` / `test123`
   - Sample places, events, and stories

4. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Places
- `GET /api/places` - Get all places (query: category, search)
- `GET /api/places/:id` - Get place by ID
- `POST /api/places` - Create place (admin only)
- `GET /api/places/heatmap/data` - Get heatmap data

### Stories
- `GET /api/stories` - Get all stories (query: tag)
- `POST /api/stories` - Create story (protected)
- `POST /api/stories/:id/like` - Like/unlike story (protected)
- `POST /api/stories/:id/comment` - Add comment (protected)
- `DELETE /api/stories/:id` - Delete story (owner/admin)

### Events
- `GET /api/events` - Get all approved events (query: category)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (protected)
- `POST /api/events/:id/attend` - Attend/unattend event (protected)

### Routes
- `GET /api/routes` - Get all routes (query: type, isPublic)
- `GET /api/routes/user/:userId` - Get user's routes
- `POST /api/routes` - Create route (protected)
- `GET /api/routes/generate/:type` - Generate route by type

### Reviews
- `GET /api/reviews/place/:placeId` - Get reviews for place
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (owner)
- `DELETE /api/reviews/:id` - Delete review (owner/admin)

### Forum
- `GET /api/forum` - Get all threads (query: category)
- `GET /api/forum/:id` - Get thread by ID
- `POST /api/forum` - Create thread (protected)
- `POST /api/forum/:id/reply` - Reply to thread (protected)
- `PUT /api/forum/:id/pin` - Pin thread (admin)
- `PUT /api/forum/:id/lock` - Lock thread (admin)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)
- `POST /api/users/profile/picture` - Upload profile picture (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard stats (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:id` - Update user (admin)
- `GET /api/admin/pending/:type` - Get pending approvals (admin)
- `PUT /api/admin/approve/:type/:id` - Approve content (admin)

## File Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── upload.js            # File upload handling
├── models/
│   ├── User.js              # User model
│   ├── Place.js             # Place model
│   ├── Story.js             # Story model
│   ├── Event.js             # Event model
│   ├── Route.js             # Route model
│   ├── Review.js            # Review model
│   └── ForumThread.js       # Forum thread model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── places.js            # Places routes
│   ├── stories.js           # Stories routes
│   ├── events.js            # Events routes
│   ├── routes.js            # Routes routes
│   ├── reviews.js           # Reviews routes
│   ├── forum.js             # Forum routes
│   ├── users.js             # Users routes
│   └── admin.js             # Admin routes
├── uploads/                 # Uploaded files (git ignored)
├── .env                     # Environment variables (git ignored)
├── .env.example             # Example environment file
├── .gitignore
├── package.json
├── seed.js                  # Database seeder
└── server.js                # Main server file
```

## Development

- **Run in development mode:** `npm run dev` (with nodemon)
- **Run in production:** `npm start`
- **Seed database:** `npm run seed`

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet.js for HTTP headers
- CORS configuration
- File upload validation
- Protected routes
- Role-based access control (admin)

## XP & Badges System

Users earn XP for activities:
- Create story: +50 XP
- Create route: +25 XP
- Write review: +10 XP

Badges unlock automatically:
- First Steps: Join the platform
- Storyteller: Share first story
- Reviewer: Write 5 reviews

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use process manager (PM2)
6. Configure reverse proxy (Nginx)

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check MongoDB service in Services app
- Verify connection string in `.env`

**Port Already in Use:**
- Change `PORT` in `.env`
- Kill process using port 5000: `npx kill-port 5000`

**File Upload Errors:**
- Ensure `uploads/` directory exists
- Check file size limit (5MB)
- Verify file types (jpg, png, gif, webp)
