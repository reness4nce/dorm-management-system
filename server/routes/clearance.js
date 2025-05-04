
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get database connection middleware
const getDb = (req, res, next) => {
  req.db = req.app.get('db');
  next();
};

// Apply authentication to all routes
router.use(authenticateToken);

// Get all clearance items for a checkout form
router.get('/form/:formId', getDb, async (req, res) => {
  try {
    const { formId } = req.params;
    
    const result = await req.db.query(`
      SELECT id, name, is_completed, completed_by, completed_date
      FROM clearance_items
      WHERE checkout_form_id = $1
      ORDER BY id ASC
    `, [formId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching clearance items:', err);
    res.status(500).json({ error: 'Failed to fetch clearance items' });
  }
});

// Update clearance item status
router.patch('/:id', getDb, async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted, completedBy } = req.body;
    
    // Validate input
    if (typeof isCompleted !== 'boolean') {
      return res.status(400).json({ error: 'isCompleted must be a boolean value' });
    }
    
    // If completing the item, require completedBy
    if (isCompleted && !completedBy) {
      return res.status(400).json({ error: 'completedBy is required when marking as completed' });
    }
    
    // Update the clearance item
    const result = await req.db.query(`
      UPDATE clearance_items
      SET is_completed = $1,
          completed_by = $2,
          completed_date = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [
      isCompleted,
      isCompleted ? completedBy : null,
      isCompleted ? new Date() : null,
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clearance item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating clearance item:', err);
    res.status(500).json({ error: 'Failed to update clearance item' });
  }
});

// Add new clearance item to a form
router.post('/', getDb, async (req, res) => {
  try {
    const { checkoutFormId, name } = req.body;
    
    // Validate input
    if (!checkoutFormId || !name) {
      return res.status(400).json({ error: 'Checkout form ID and name are required' });
    }
    
    // Check if checkout form exists
    const formCheck = await req.db.query(`
      SELECT id FROM checkout_forms WHERE id = $1
    `, [checkoutFormId]);
    
    if (formCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Checkout form not found' });
    }
    
    // Create new clearance item
    const result = await req.db.query(`
      INSERT INTO clearance_items (checkout_form_id, name, is_completed)
      VALUES ($1, $2, false)
      RETURNING *
    `, [checkoutFormId, name]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating clearance item:', err);
    res.status(500).json({ error: 'Failed to create clearance item' });
  }
});

// Delete clearance item
router.delete('/:id', getDb, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the clearance item
    const result = await req.db.query(`
      DELETE FROM clearance_items
      WHERE id = $1
      RETURNING id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clearance item not found' });
    }
    
    res.json({ message: 'Clearance item deleted successfully' });
  } catch (err) {
    console.error('Error deleting clearance item:', err);
    res.status(500).json({ error: 'Failed to delete clearance item' });
  }
});

module.exports = router;