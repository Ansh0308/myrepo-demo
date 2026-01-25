# 🚀 Quick Start Guide

Get your Habit Tracker up and running in minutes!

## Prerequisites

- **Node.js 18+** and npm installed
- **MongoDB** installed and running (or a MongoDB Atlas account)

## Installation Steps

### 1. Install Dependencies

From the project root:

```bash
# Install root dependencies (concurrently for running both servers)
npm install

# Install all dependencies for both frontend and backend
npm run install:all
```

Or manually:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB
mongod
```

**Option B: MongoDB Atlas**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `backend/.env` with your connection string

The backend `.env` file is already configured for local MongoDB:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=habit_tracker_secret_key_2024
NODE_ENV=development
```

### 3. Start the Application

**Option A: Run Both Servers Together (Recommended)**
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend app on `http://localhost:3000`

**Option B: Run Servers Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 4. Open the App

Navigate to `http://localhost:3000` in your browser.

## First Steps in the App

1. **Create Your First Habit**
   - Click "New Habit" button
   - Fill in name, category, choose an icon and color
   - Click "Create Habit"

2. **Track Your Progress**
   - Click "Mark as Complete" on any habit
   - Watch your streak grow! 🔥

3. **Explore Features**
   - **Dashboard**: View and manage all habits
   - **Calendar**: See monthly completion view
   - **Analytics**: Beautiful charts and statistics
   - **Settings**: Export data, enable notifications, toggle dark mode

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution**: Make sure MongoDB is running. If using local MongoDB, run `mongod` in a terminal.

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Stop other processes using port 5000, or change the port in `backend/.env`

### Module Not Found Errors
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies: `npm run install:all`

## Production Build

### Build Frontend
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Run Production Servers
```bash
# Backend
cd backend
npm start

# Frontend (preview mode)
cd frontend
npm run preview
```

## Environment Variables

Edit `backend/.env` to configure:

- `PORT` - Backend server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `NODE_ENV` - Environment (development/production)

## Features Checklist

After setup, verify all features work:

- [ ] Create, edit, delete habits
- [ ] Mark habits as complete
- [ ] View streaks and statistics
- [ ] Calendar view with completions
- [ ] Analytics charts display correctly
- [ ] Dark mode toggle works
- [ ] Export data as JSON
- [ ] Import data from JSON
- [ ] Browser notifications (if enabled)
- [ ] Responsive design on mobile

## Next Steps

- Customize habit categories in `frontend/src/types/index.ts`
- Modify colors in `frontend/tailwind.config.js`
- Add more chart types in `frontend/src/components/Analytics.tsx`
- Deploy to a hosting platform (Vercel, Netlify, Heroku, etc.)

## Need Help?

Check the main [README.md](README.md) for detailed documentation, API endpoints, and architecture information.

---

Happy habit tracking! 🎯✨
