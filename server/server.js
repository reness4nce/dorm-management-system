const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const authRoutes = require('./routes/auth');
const residentRoutes = require('./routes/residents');
const checkoutRoutes = require('./routes/checkout');
const clearanceRoutes = require('./routes/clearance');
const productRoutes = require('./routes/productRoutes.js');
const { sql } = require('./config/db.js');
const { aj } = require('./lib/arcjet.js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan('dev'));

// Database connection (Neon configuration)
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to Neon PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// Make db pool available for route handlers
app.set('db', pool);

// Apply Arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: 'Too Many Requests' });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: 'Bot access denied' });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
      return;
    }

    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: 'Spoofed bot detected' });
      return;
    }

    next();
  } catch (error) {
    console.log('Arcjet error', error);
    next(error);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/clearance', clearanceRoutes);
app.use('/api/products', productRoutes);

// Base route for API testing
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to ALGCIT Dorm Management API' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.log('Error initDB', error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
