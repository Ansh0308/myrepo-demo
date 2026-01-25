# 🛠️ Development Guide

## Project Overview

This is a full-stack habit tracker application built with the MERN stack (MongoDB, Express, React, Node.js) featuring a beautiful glassmorphism design.

## Architecture

```
habit-tracker/
├── backend/              # Express API server
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Main server file
│   ├── .env             # Environment variables
│   └── package.json
├── frontend/            # React application
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── api/         # API client functions
│   │   ├── components/  # React components
│   │   ├── context/     # React context providers
│   │   ├── types/       # TypeScript type definitions
│   │   ├── utils/       # Utility functions
│   │   ├── App.tsx      # Main app component
│   │   ├── main.tsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
└── package.json         # Root package.json with helper scripts
```

## Data Models

### Habit
```javascript
{
  name: String,
  description: String,
  color: String,
  icon: String,
  category: String, // Health, Fitness, Learning, etc.
  frequency: {
    type: String, // daily, weekly, custom
    customDays: [Number],
    targetPerWeek: Number
  },
  reminderEnabled: Boolean,
  reminderTime: String,
  createdAt: Date,
  userId: String
}
```

### HabitLog
```javascript
{
  habitId: ObjectId,
  date: Date,
  completed: Boolean,
  note: String,
  createdAt: Date,
  userId: String
}
```

### UserPreferences
```javascript
{
  userId: String,
  darkMode: Boolean,
  notificationsEnabled: Boolean,
  weekStartsOn: Number,
  defaultView: String, // grid, list, calendar
  updatedAt: Date
}
```

## API Endpoints

### Habits
- `GET /api/habits` - Get all habits
- `GET /api/habits/:id` - Get specific habit
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Logs
- `GET /api/logs` - Get logs (supports filters)
- `POST /api/logs` - Create/update log
- `DELETE /api/logs/:id` - Delete log
- `DELETE /api/logs/habit/:habitId/date/:date` - Delete specific log

### Analytics
- `GET /api/analytics/streaks/:habitId` - Calculate streaks
- `GET /api/analytics/completion-rate/:habitId` - Get completion rate
- `GET /api/analytics/overview` - Get overall statistics
- `GET /api/analytics/daily-progress` - Get daily progress data

### Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences

### Export/Import
- `GET /api/export/data` - Export all data
- `POST /api/export/import` - Import data

## Frontend Components

### Core Components
- `App.tsx` - Main application component with routing logic
- `Header.tsx` - Top navigation bar with dark mode toggle
- `Sidebar.tsx` - Navigation sidebar with menu items

### Views
- `Dashboard.tsx` - Main habit list and management view
- `CalendarView.tsx` - Monthly calendar with completion indicators
- `Analytics.tsx` - Charts and statistics view
- `Settings.tsx` - App settings and data management

### UI Components
- `HabitCard.tsx` - Individual habit card with completion tracking
- `HabitModal.tsx` - Modal for creating/editing habits

### Context Providers
- `ThemeContext.tsx` - Dark mode state management

## Styling

### Glassmorphism Design
The app uses custom CSS classes for glassmorphism effects:

```css
.glass-card {
  backdrop-blur: blur(xl);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-card-strong {
  backdrop-blur: blur(2xl);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Gradient Backgrounds
Animated gradient backgrounds using CSS animations:

```css
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, ...);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

### Dark Mode
- Tailwind's `dark:` prefix for dark mode styles
- Context-based state management
- Persisted to localStorage and backend

## Development Workflow

### Adding a New Feature

1. **Backend Changes**
   ```bash
   cd backend
   # Add model in models/
   # Add routes in routes/
   # Update server.js if needed
   npm run dev
   ```

2. **Frontend Changes**
   ```bash
   cd frontend
   # Add types in src/types/
   # Add API functions in src/api/
   # Add components in src/components/
   npm run dev
   ```

3. **Testing**
   - Test API endpoints using Postman or curl
   - Test UI components in browser
   - Verify dark mode compatibility
   - Test responsive design on mobile

### Adding a New Category

1. Update `Category` type in `frontend/src/types/index.ts`
2. Update category enum in `backend/models/Habit.js`
3. Add category to list in `Dashboard.tsx`

### Customizing Colors

Edit the colors array in `frontend/src/components/HabitModal.tsx`:

```typescript
const colors = [
  '#ef4444', '#f97316', // Add more colors here
];
```

### Adding New Charts

Use Recharts in `frontend/src/components/Analytics.tsx`:

```tsx
import { LineChart, Line, ... } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    {/* Chart configuration */}
  </LineChart>
</ResponsiveContainer>
```

## Common Tasks

### Reset Database
```bash
# Connect to MongoDB
mongo
use habit-tracker
db.dropDatabase()
```

### Clear Browser Data
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Debug API Calls
```typescript
// In frontend/src/api/index.ts
console.log('Request:', method, url, data);
console.log('Response:', response);
```

### Test Notifications
```javascript
// In browser console
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('Test', { body: 'It works!' });
  }
});
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize Recharts with smaller datasets
- Use Vite's code splitting

### Backend
- Add database indexes for frequently queried fields
- Implement caching with Redis (optional)
- Use pagination for large datasets
- Optimize MongoDB queries with projection

## Security Considerations

### Current Implementation
- Basic user ID system (single user)
- Input validation with express-validator
- CORS enabled for development

### Production Recommendations
- Implement proper authentication (JWT, OAuth)
- Add rate limiting
- Sanitize user inputs
- Use HTTPS
- Set secure environment variables
- Implement user authorization

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Deploy with Procfile
```

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update `MONGODB_URI` in production

## Troubleshooting

### TypeScript Errors
```bash
cd frontend
npx tsc --noEmit
```

### Linting
```bash
cd frontend
npm run lint
```

### Port Conflicts
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Social features (share progress, compete with friends)
- [ ] Habit templates and suggestions
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML predictions
- [ ] Integration with health apps (Apple Health, Google Fit)
- [ ] Custom themes and color schemes
- [ ] Habit groups and dependencies
- [ ] Reward system and achievements
- [ ] API webhooks for integrations

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)

---

Happy coding! 🚀
