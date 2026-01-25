const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const habitsRouter = require('./routes/habits');
const logsRouter = require('./routes/logs');
const analyticsRouter = require('./routes/analytics');
const preferencesRouter = require('./routes/preferences');
const exportRouter = require('./routes/export');

app.use('/api/habits', habitsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/export', exportRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Habit Tracker API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
