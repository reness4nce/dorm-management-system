
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to get database connection
const getDb = (req, res, next) => {
  req.db = req.app.get('db');
  next();
};

// Login route
router.post('/login', getDb, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const result = await req.db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    const user = result.rows[0];
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      }, 
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN 
      }
    );
    
    // Return user data without password
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check current user
router.get('/me', getDb, async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await req.db.query(
      'SELECT id, username, role, first_name, last_name, email FROM users WHERE id = $1',
      [decoded.id]
    );
    
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;