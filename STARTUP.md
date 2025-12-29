# 🚀 Discover Dhaka - Complete Startup Guide

## Prerequisites Installation

### 1. Install MongoDB (REQUIRED)

**Option A: Official Installer (Recommended)**
1. Go to https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server for Windows
3. Run the installer
4. Choose "Complete" installation
5. ✅ Check "Install MongoDB as a Service"
6. Leave default data and log directories
7. Complete installation

**Option B: Chocolatey**
```powershell
choco install mongodb
```

**Verify Installation:**
```powershell
mongod --version
```

### 2. Start MongoDB

**If installed as service (automatic):**
- MongoDB should start automatically
- Verify in Services app (Win + R → services.msc → MongoDB Server)

**Manual start:**
```powershell
mongod
```
Leave this terminal open while using the app.

**Verify MongoDB is running:**
```powershell
# In a new terminal
mongosh
# Should connect to mongodb://127.0.0.1:27017
```

## Quick Start (After MongoDB is Running)

### Terminal 1: Backend Setup
```bash
# Navigate to backend
cd c:\Users\Admin\Desktop\discover-dhaka-web\backend

# Install dependencies (already done)
npm install

# Seed the database with test data
npm run seed

# Start backend server
npm run dev
```

**Expected output:**
```
MongoDB Connected: localhost
Server running on port 5000
```

### Terminal 2: Frontend
```bash
# Navigate to project root
cd c:\Users\Admin\Desktop\discover-dhaka-web

# Start React app
npm start
```

**Expected output:**
```
Compiled successfully!
Local: http://localhost:3000
```

## Test Accounts

After running `npm run seed`, you'll have:

**Admin Account:**
- Email: `admin@discoverdhaka.com`
- Password: `admin123`
- Can approve events, manage users

**Test User:**
- Email: `test@test.com`
- Password: `test123`
- Regular user account

## Verify Everything Works

1. ✅ Frontend loads at http://localhost:3000
2. ✅ Backend responds at http://localhost:5000/api
3. ✅ MongoDB connected (check backend terminal)
4. ✅ Can login with test accounts
5. ✅ Map shows places
6. ✅ Can create stories, save places

## Troubleshooting

### MongoDB Connection Failed
**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Check MongoDB is running: `mongod`
2. Check Windows Services for "MongoDB Server"
3. Verify connection string in `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/discover-dhaka
   ```

### Port 5000 Already in Use
**Error:** `EADDRINUSE :::5000`

**Solution:**
```powershell
# Kill process on port 5000
npx kill-port 5000

# Or change port in backend/.env
PORT=5001
```

### Port 3000 Already in Use
**Solution:**
- Press `Y` when prompted to use different port
- Or kill port 3000: `npx kill-port 3000`

### "Cannot GET /api/..."
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend (defaults to localhost:5000)

### File Upload Errors
- Ensure `backend/uploads/` directory exists
- Check file size (max 5MB)
- Supported formats: jpg, jpeg, png, gif, webp

## Development Workflow

**Starting fresh each day:**
1. Start MongoDB (if not service)
2. Start backend: `npm run dev` in backend folder
3. Start frontend: `npm start` in root folder

**Making changes:**
- Backend auto-reloads with nodemon
- Frontend hot-reloads automatically
- Database persists between restarts

**Resetting data:**
```bash
cd backend
npm run seed
```
This clears and re-seeds the database.

## API Endpoints

Base URL: `http://localhost:5000/api`

- `/auth/register` - Create account
- `/auth/login` - Login
- `/places` - Browse places
- `/stories` - Read/create stories
- `/events` - Browse events
- `/routes` - Custom routes
- `/reviews` - Place reviews
- `/forum` - Community forum
- `/users` - User profiles
- `/admin` - Admin dashboard

See `backend/README.md` for complete API documentation.

## What's Implemented

✅ **Backend (Complete):**
- Node.js + Express server
- MongoDB database with 7 models
- JWT authentication
- File uploads (images)
- Full REST API (9 route modules)
- XP & badges system
- Admin functionality

✅ **Frontend (Integrated):**
- API client with axios
- Updated AuthContext
- Ready for API integration

🔄 **Next Steps:**
- Update all components to use API
- Add loading states
- Implement error handling
- Connect map features to API
- Build admin dashboard
- Add forum UI
- Heritage mode
- Dark mode

## Project Structure

```
discover-dhaka-web/
├── backend/              # Node.js + Express API
│   ├── config/          # Database connection
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, uploads
│   └── uploads/         # User-uploaded images
├── src/
│   ├── api/            # API client & services
│   ├── components/     # React components
│   ├── contexts/       # Auth context (API-connected)
│   └── data/           # Mock data (legacy)
└── public/             # Static assets
```

## Common Commands

```bash
# Backend
cd backend
npm run dev          # Start with auto-reload
npm run seed         # Reset database
npm start            # Production mode

# Frontend
npm start            # Development server
npm build            # Production build
npm test             # Run tests

# Both
npm install          # Install dependencies
```

## Need Help?

1. Check terminal output for errors
2. Verify MongoDB is running
3. Check both servers are on correct ports
4. Review backend/README.md for API docs
5. Check browser console for frontend errors
