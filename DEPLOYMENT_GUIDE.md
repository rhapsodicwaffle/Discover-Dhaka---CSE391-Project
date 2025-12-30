# 🚀 Deployment Guide: Railway + Vercel

## Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Your Supabase credentials ready

---

## 📦 Part 1: Push to GitHub

### 1. Initialize Git Repository

```bash
cd "c:\Users\cc\Downloads\Discover-Dhaka---CSE391-Project-main\Discover-Dhaka---CSE391-Project-main"
git init
git add .
git commit -m "Initial commit - Discover Dhaka project"
```

### 2. Create GitHub Repository
- Go to https://github.com/new
- Create a new repository named `discover-dhaka`
- Don't initialize with README (we already have files)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/discover-dhaka.git
git branch -M main
git push -u origin main
```

---

## 🚂 Part 2: Deploy Backend to Railway

### 1. Sign Up/Login to Railway
- Go to https://railway.app
- Sign up with GitHub

### 2. Create New Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose your `discover-dhaka` repository
- Railway will auto-detect it's a Node.js project

### 3. Configure Backend Service
- Click on your service
- Go to **Settings** tab
- Set **Root Directory**: `backend`
- Set **Start Command**: `node server.js`

### 4. Add Environment Variables
Go to **Variables** tab and add:

```env
PORT=5000
SUPABASE_URL=https://opoqofyjoznizvmvinrm.supabase.co
SUPABASE_KEY=sb_publishable_xAU5GSmpGd8kEN0eFrsiuA_Xuqsi8Bf
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Important Notes:**
- Generate a strong JWT_SECRET (use: https://randomkeygen.com/)
- CLIENT_URL will be your Vercel URL (add later)

### 5. Deploy
- Railway will automatically deploy
- Wait for deployment to complete
- Copy your Railway URL (e.g., `https://your-app.railway.app`)

---

## ⚡ Part 3: Deploy Frontend to Vercel

### 1. Sign Up/Login to Vercel
- Go to https://vercel.com
- Sign up with GitHub

### 2. Import Project
- Click **"Add New..."** → **"Project"**
- Import your `discover-dhaka` repository
- Vercel will auto-detect it's a Create React App

### 3. Configure Build Settings
- **Root Directory**: `.` (leave empty or root)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4. Add Environment Variable
Click **"Environment Variables"** and add:

```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

**Replace** `your-backend.railway.app` with your actual Railway URL from Part 2.

### 5. Deploy
- Click **"Deploy"**
- Wait for build to complete (2-3 minutes)
- Your frontend will be live at `https://your-app.vercel.app`

---

## 🔄 Part 4: Update Backend with Frontend URL

### 1. Go back to Railway
- Open your Railway project
- Go to **Variables** tab

### 2. Update CLIENT_URL
```env
CLIENT_URL=https://your-app.vercel.app
```

**Replace** with your actual Vercel URL from Part 3.

### 3. Redeploy
- Railway will automatically redeploy with new settings

---

## ✅ Part 5: Test Your Deployment

### 1. Visit Your Site
- Open your Vercel URL: `https://your-app.vercel.app`

### 2. Test Features
- ✅ Login/Register
- ✅ View places on map
- ✅ Create stories
- ✅ Upload images
- ✅ Admin dashboard

---

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check Railway logs
railway logs
```

**Common issues:**
- ❌ **500 errors**: Check environment variables
- ❌ **Cannot connect**: Check SUPABASE_URL and SUPABASE_KEY
- ❌ **CORS errors**: Verify CLIENT_URL is correct

### Frontend Issues
**Common issues:**
- ❌ **Can't reach backend**: Check REACT_APP_API_URL
- ❌ **Images not loading**: Verify Supabase storage policies
- ❌ **Build fails**: Check for missing dependencies

---

## 🎉 You're Live!

Your app is now hosted at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

### Future Updates
Both platforms support automatic deployments:
```bash
git add .
git commit -m "Your changes"
git push
```

Railway and Vercel will automatically rebuild and deploy! 🚀

---

## 📝 Important URLs to Save

1. **Frontend URL**: _________________
2. **Backend URL**: _________________
3. **GitHub Repo**: _________________
4. **Supabase Dashboard**: https://supabase.com/dashboard
5. **Railway Dashboard**: https://railway.app/dashboard
6. **Vercel Dashboard**: https://vercel.com/dashboard

---

## 💰 Cost Breakdown

- **Supabase**: Free tier (500MB database, 1GB storage)
- **Railway**: $5/month (500 hours free trial)
- **Vercel**: Free for personal projects
- **Total**: ~$5/month after Railway trial

---

## 🔐 Security Checklist

- ✅ Change JWT_SECRET from default
- ✅ Use environment variables (never commit .env)
- ✅ HTTPS enabled (automatic on Railway/Vercel)
- ✅ CORS configured correctly
- ✅ Supabase RLS policies enabled
- ✅ Rate limiting enabled

---

Need help? Check:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
