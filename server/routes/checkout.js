
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

// Get all checkout forms
router.get('/', getDb, async (req, res) => {
  try {
    // Get all checkout forms with their clearance items
    const forms = await req.db.query(`
      SELECT 
        cf.id, cf.resident_id, cf.reason, cf.intended_date, cf.intended_time,
        cf.return_date, cf.return_time, cf.submission_date, cf.status,
        cf.approved_by, cf.approval_date, cf.notes
      FROM checkout_forms cf
      ORDER BY cf.submission_date DESC
    `);
    
    // For each form, get its clearance items
    for (let i = 0; i < forms.rows.length; i++) {
      const clearanceItems = await req.db.query(`
        SELECT id, name, is_completed, completed_by, completed_date
        FROM clearance_items
        WHERE checkout_form_id = $1
      `, [forms.rows[i].id]);
      
      forms.rows[i].clearance_items = clearanceItems.rows;
    }
    
    res.json(forms.rows);
  } catch (err) {
    console.error('Error fetching checkout forms:', err);
    res.status(500).json({ error: 'Failed to fetch checkout forms' });
  }
});

// Get checkout form by ID
router.get('/:id', getDb, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get checkout form
    const formResult = await req.db.query(`
      SELECT * FROM checkout_forms WHERE id = $1
    `, [id]);
    
    if (formResult.rows.length === 0) {
      return res.status(404).json({ error: 'Checkout form not found' });
    }
    
    const form = formResult.rows[0];
    
    // Get clearance items for this form
    const clearanceItems = await req.db.query(`
      SELECT id, name, is_completed, completed_by, completed_date
      FROM clearance_items
      WHERE checkout_form_id = $1
    `, [id]);
    
    form.clearance_items = clearanceItems.rows;
    
    res.json(form);
  } catch (err) {
    console.error('Error fetching checkout form:', err);
    res.status(500).json({ error: 'Failed to fetch checkout form' });
  }
});

// Create new checkout form
router.post('/', getDb, async (req, res) => {
  try {
    const { 
      residentId, reason, intendedDate, intendedTime, 
      returnDate, returnTime, clearanceItems 
    } = req.body;
    
    // Validate input
    if (!residentId || !reason || !intendedDate || !intendedTime) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    // Begin transaction
    await req.db.query('BEGIN');
    
    // Create the checkout form
    const formResult = await req.db.query(`
      INSERT INTO checkout_forms
        (resident_id, reason, intended_date, intended_time, return_date, return_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [residentId, reason, intendedDate, intendedTime, returnDate || null, returnTime || null]);
    
    const newForm = formResult.rows[0];
    
    // Update resident status
    await req.db.query(`
      UPDATE residents
      SET checkout_status = 'pending'
      WHERE id = $1
    `, [residentId]);
    
    // Add clearance items if provided
    if (clearanceItems && clearanceItems.length > 0) {
      for (const item of clearanceItems) {
        await req.db.query(`
          INSERT INTO clearance_items
            (checkout_form_id, name, is_completed)
          VALUES ($1, $2, false)
        `, [newForm.id, item.name]);
      }
    } else {
      // Add default clearance items
      const defaultItems = [
        'Room Inspection', 
        'Property Inventory Check', 
        'Key Return', 
        'Payment Verification'
      ];
      
      for (const itemName of defaultItems) {
        await req.db.query(`
          INSERT INTO clearance_items
            (checkout_form_id, name, is_completed)
          VALUES ($1, $2, false)
        `, [newForm.id, itemName]);
      }
    }
    
    // Commit transaction
    await req.db.query('COMMIT');
    
    // Get full form with clearance items
    const completeFormResult = await req.db.query(`
      SELECT * FROM checkout_forms WHERE id = $1
    `, [newForm.id]);
    
    const clearanceItemsResult = await req.db.query(`
      SELECT id, name, is_completed, completed_by, completed_date
      FROM clearance_items
      WHERE checkout_form_id = $1
    `, [newForm.id]);
    
    const completeForm = completeFormResult.rows[0];
    completeForm.clearance_items = clearanceItemsResult.rows;
    
    res.status(201).json(completeForm);
  } catch (err) {
    // Rollback transaction on error
    await req.db.query('ROLLBACK');
    console.error('Error creating checkout form:', err);
    res.status(500).json({ error: 'Failed to create checkout form' });
  }
});

// Update checkout form status
router.patch('/:id/status', getDb, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Get the form to check resident ID
    const formCheck = await req.db.query(`
      SELECT resident_id FROM checkout_forms WHERE id = $1
    `, [id]);
    
    if (formCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Checkout form not found' });
    }
    
    const residentId = formCheck.rows[0].resident_id;
    
    // Begin transaction
    await req.db.query('BEGIN');
    
    // Update checkout form status
    const result = await req.db.query(`
      UPDATE checkout_forms
      SET status = $1, 
          approved_by = $2,
          approval_date = CASE WHEN $1 IN ('approved', 'rejected') THEN CURRENT_TIMESTAMP ELSE approval_date END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, approvedBy || null, id]);
    
    if (result.rows.length === 0) {
      await req.db.query('ROLLBACK');
      return res.status(404).json({ error: 'Checkout form not found' });
    }
    
    // Update resident checkout status
    await req.db.query(`
      UPDATE residents
      SET checkout_status = $1
      WHERE id = $2
    `, [status, residentId]);
    
    // Commit transaction
    await req.db.query('COMMIT');
    
    // Get clearance items for the form
    const clearanceItems = await req.db.query(`
      SELECT id, name, is_completed, completed_by, completed_date
      FROM clearance_items
      WHERE checkout_form_id = $1
    `, [id]);
    
    const updatedForm = result.rows[0];
    updatedForm.clearance_items = clearanceItems.rows;
    
    res.json(updatedForm);
  } catch (err) {
    await req.db.query('ROLLBACK');
    console.error('Error updating checkout form status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
