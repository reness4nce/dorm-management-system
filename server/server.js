
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const residentRoutes = require('./routes/residents');
const checkoutRoutes = require('./routes/checkout');
const clearanceRoutes = require('./routes/clearance');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// Make db pool available for route handlers
app.set('db', pool);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/clearance', clearanceRoutes);

// Base route for API testing
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to ALGCIT Dorm Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
