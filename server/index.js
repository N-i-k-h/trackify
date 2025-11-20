const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load .env only in local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
  require('dotenv').config();
}

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const profileRoutes = require('./routes/profile');

const app = express();

// If you're behind a proxy (Render, Heroku), trust proxy for secure cookies, etc.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API (register routes BEFORE static & SPA fallback)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);

// Health
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Serve Vite build (client/dist)
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// SPA fallback — must come after API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Connect to Mongo and only start listening after a successful DB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // optional mongoose options can go here
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    // Optionally exit process so the host can restart the service (Render will attempt a restart)
    process.exit(1);
  }
};

startServer();
