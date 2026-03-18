const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all hostings
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hostings ORDER BY expirationDate ASC');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error getting hostings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET hosting by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hostings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hosting không tồn tại'
      });
    }
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error getting hosting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE hosting
router.post('/', async (req, res) => {
  try {
    const { id, name, domain, provider, registrationDate, expirationDate, price, status, notes, createdAt } = req.body;
    
    await pool.query(
      `INSERT INTO hostings (id, name, domain, provider, registrationDate, expirationDate, price, status, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, domain, provider, registrationDate, expirationDate, price || 0, status || 'active', notes, createdAt || new Date()]
    );

    res.json({
      success: true,
      data: req.body,
      message: 'Hosting đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error creating hosting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE hosting
router.put('/:id', async (req, res) => {
  try {
    const { name, domain, provider, registrationDate, expirationDate, price, status, notes } = req.body;
    
    const [result] = await pool.query(
      `UPDATE hostings 
       SET name = ?, domain = ?, provider = ?, registrationDate = ?, expirationDate = ?, 
           price = ?, status = ?, notes = ?
       WHERE id = ?`,
      [name, domain, provider, registrationDate, expirationDate, price, status, notes, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hosting không tồn tại'
      });
    }

    res.json({
      success: true,
      data: req.body,
      message: 'Hosting đã được cập nhật'
    });
  } catch (error) {
    console.error('Error updating hosting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE hosting
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM hostings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hosting không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Hosting đã được xóa'
    });
  } catch (error) {
    console.error('Error deleting hosting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
