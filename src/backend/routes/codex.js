const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all code snippets
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM codex ORDER BY createdAt DESC');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error getting codex:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET code snippet by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM codex WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Code snippet không tồn tại'
      });
    }
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error getting code snippet:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE code snippet
router.post('/', async (req, res) => {
  try {
    const { id, name, type, content, description, createdAt } = req.body;
    
    await pool.query(
      `INSERT INTO codex (id, name, type, content, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, type || 'javascript', content, description, createdAt || new Date()]
    );

    res.json({
      success: true,
      data: req.body,
      message: 'Code snippet đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error creating code snippet:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE code snippet
router.put('/:id', async (req, res) => {
  try {
    const { name, type, content, description } = req.body;
    
    const [result] = await pool.query(
      `UPDATE codex 
       SET name = ?, type = ?, content = ?, description = ?
       WHERE id = ?`,
      [name, type, content, description, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Code snippet không tồn tại'
      });
    }

    res.json({
      success: true,
      data: req.body,
      message: 'Code snippet đã được cập nhật'
    });
  } catch (error) {
    console.error('Error updating code snippet:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE code snippet
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM codex WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Code snippet không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Code snippet đã được xóa'
    });
  } catch (error) {
    console.error('Error deleting code snippet:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
