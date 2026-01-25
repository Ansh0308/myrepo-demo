# 🎯 Habit Tracker - Beautiful Glassmorphism Design

A comprehensive, visually stunning habit tracker application featuring a vibrant glassmorphism design aesthetic. Build better habits, track your progress, and achieve your goals with style!

## ✨ Features

### Core Functionality
- ✅ **Habit Management** - Create, edit, and delete habits with custom colors and icons
- 📊 **Daily Logging** - Quick checkmark system with visual feedback
- 🔥 **Streak Tracking** - Monitor current and best streaks for each habit
- 📈 **Progress Analytics** - Beautiful charts showing daily, weekly, and monthly progress
- 📝 **Notes & Journal** - Add notes when completing habits
- 📅 **Calendar View** - Visual month view with completion indicators
- 🏷️ **Categories** - Organize habits by category (Health, Fitness, Learning, etc.)
- 🔔 **Notifications** - Browser notifications for habit reminders
- 💾 **Data Export/Import** - Backup and restore your data as JSON
- 🌓 **Dark Mode** - Beautiful dark mode with smooth transitions

### Design
- 🎨 Colorful and vibrant glassmorphism UI
- ✨ Smooth animations and transitions
- 📱 Fully responsive (desktop and mobile)
- 🎭 Custom color and icon selection for each habit
- 🌈 Gradient backgrounds with animated shifts

## 🚀 Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling with custom glassmorphism effects
- **Recharts** - Beautiful, responsive charts
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **Date-fns** - Modern date utility library
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Request validation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd habit-tracker
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

## 🏃 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the backend server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

3. **Start the frontend development server**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

4. Open your browser and navigate to `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📱 Usage

### Creating a Habit
1. Click the "New Habit" button
2. Fill in the habit details:
   - Name and description
   - Choose a category
   - Select an icon and color
   - Set frequency (daily, weekly, custom)
   - Enable reminders if desired
3. Click "Create Habit"

### Tracking Habits
- Click the "Mark as Complete" button on any habit card to log completion for today
- View your current streak and best streak
- Edit or delete habits using the buttons that appear on hover

### Viewing Analytics
- Navigate to the Analytics page for detailed statistics
- See daily progress charts
- View category-wise breakdowns
- Monitor completion rates

### Calendar View
- View all your completions in a monthly calendar
- Click any date to see and edit completions for that day
- Visual indicators show completion count per day

### Data Management
- Export your data from Settings → Data Management → Export
- Import previously exported data to restore your habits and logs
- Clear all data if needed (use with caution!)

## 🎨 Design Philosophy

This app embraces **glassmorphism** - a design trend featuring:
- Frosted glass effects with transparency
- Vibrant gradient backgrounds
- Subtle borders and shadows
- Depth and hierarchy through blur and opacity
- Smooth, delightful animations

The color palette is vibrant and energetic, designed to motivate and inspire users to build better habits.

## 🔧 API Endpoints

### Habits
- `GET /api/habits` - Get all habits
- `GET /api/habits/:id` - Get habit by ID
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Logs
- `GET /api/logs` - Get all logs (with filters)
- `POST /api/logs` - Create/update log
- `DELETE /api/logs/:id` - Delete log
- `DELETE /api/logs/habit/:habitId/date/:date` - Delete specific log

### Analytics
- `GET /api/analytics/streaks/:habitId` - Get streak data
- `GET /api/analytics/completion-rate/:habitId` - Get completion rate
- `GET /api/analytics/overview` - Get overall statistics
- `GET /api/analytics/daily-progress` - Get daily progress data

### Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences

### Export/Import
- `GET /api/export/data` - Export all data
- `POST /api/export/import` - Import data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Icons by Lucide React
- Charts by Recharts
- Styling with Tailwind CSS
- Notifications by React Hot Toast

---

Built with ❤️ and ☕ - Happy habit tracking! 🎯
