const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all passwords
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM passwords ORDER BY createdAt DESC');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error getting passwords:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET password by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM passwords WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Password không tồn tại'
      });
    }
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error getting password:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE password
router.post('/', async (req, res) => {
  try {
    const { id, title, username, password, website, notes, category, createdAt } = req.body;
    
    await pool.query(
      `INSERT INTO passwords (id, title, username, password, website, notes, category, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, username, password, website, notes, category || 'uncategorized', createdAt || new Date()]
    );

    res.json({
      success: true,
      data: req.body,
      message: 'Password đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error creating password:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE password
router.put('/:id', async (req, res) => {
  try {
    const { title, username, password, website, notes, category } = req.body;
    
    const [result] = await pool.query(
      `UPDATE passwords 
       SET title = ?, username = ?, password = ?, website = ?, notes = ?, category = ?
       WHERE id = ?`,
      [title, username, password, website, notes, category, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Password không tồn tại'
      });
    }

    res.json({
      success: true,
      data: req.body,
      message: 'Password đã được cập nhật'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE password
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM passwords WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Password không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Password đã được xóa'
    });
  } catch (error) {
    console.error('Error deleting password:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
