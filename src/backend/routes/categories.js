const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET category by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category không tồn tại'
      });
    }
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE category
router.post('/', async (req, res) => {
  try {
    const { id, name, color } = req.body;
    
    await pool.query(
      `INSERT INTO categories (id, name, color)
       VALUES (?, ?, ?)`,
      [id, name, color || '#6B7280']
    );

    res.json({
      success: true,
      data: req.body,
      message: 'Category đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    // Check for duplicate name
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'Tên category đã tồn tại'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE category
router.put('/:id', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    const [result] = await pool.query(
      `UPDATE categories 
       SET name = ?, color = ?
       WHERE id = ?`,
      [name, color, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category không tồn tại'
      });
    }

    res.json({
      success: true,
      data: req.body,
      message: 'Category đã được cập nhật'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'Tên category đã tồn tại'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    // Check if category is being used by passwords
    const [passwords] = await pool.query('SELECT COUNT(*) as count FROM passwords WHERE category = ?', [req.params.id]);
    
    if (passwords[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: `Không thể xóa category này vì có ${passwords[0].count} password đang sử dụng`
      });
    }

    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Category đã được xóa'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
