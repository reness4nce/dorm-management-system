
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get database connection middleware
const getDb = (req, res, next) => {
  req.db = req.app.get('db');
  next();
};

// Apply authentication to all routes in this file
router.use(authenticateToken);

// Get all residents
router.get('/', getDb, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM residents ORDER BY last_name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching residents:', err);
    res.status(500).json({ error: 'Failed to fetch residents' });
  }
});

// Get resident by ID
router.get('/:id', getDb, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.db.query(
      'SELECT * FROM residents WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching resident:', err);
    res.status(500).json({ error: 'Failed to fetch resident' });
  }
});

// Create new resident
router.post('/', getDb, async (req, res) => {
  try {
    const { firstName, lastName, studentId, strand, gradeLevel, contactNumber, roomNumber } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !studentId || !strand || !gradeLevel || !contactNumber || !roomNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if student ID already exists
    const existingCheck = await req.db.query(
      'SELECT * FROM residents WHERE student_id = $1',
      [studentId]
    );
    
    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }
    
    // Insert new resident
    const result = await req.db.query(
      `INSERT INTO residents 
       (first_name, last_name, student_id, strand, grade_level, contact_number, room_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [firstName, lastName, studentId, strand, gradeLevel, contactNumber, roomNumber]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating resident:', err);
    res.status(500).json({ error: 'Failed to create resident' });
  }
});

// Update resident
router.put('/:id', getDb, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, studentId, strand, gradeLevel, contactNumber, roomNumber } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !studentId || !strand || !gradeLevel || !contactNumber || !roomNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if student ID exists for another resident
    const existingCheck = await req.db.query(
      'SELECT * FROM residents WHERE student_id = $1 AND id != $2',
      [studentId, id]
    );
    
    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Student ID already exists for another resident' });
    }
    
    // Update resident
    const result = await req.db.query(
      `UPDATE residents
       SET first_name = $1, last_name = $2, student_id = $3, strand = $4,
           grade_level = $5, contact_number = $6, room_number = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [firstName, lastName, studentId, strand, gradeLevel, contactNumber, roomNumber, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating resident:', err);
    res.status(500).json({ error: 'Failed to update resident' });
  }
});

// Delete resident
router.delete('/:id', getDb, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if resident exists
    const checkResult = await req.db.query(
      'SELECT * FROM residents WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    
    // Delete resident
    await req.db.query(
      'DELETE FROM residents WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Resident deleted successfully' });
  } catch (err) {
    console.error('Error deleting resident:', err);
    res.status(500).json({ error: 'Failed to delete resident' });
  }
});

module.exports = router;