const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY createdAt DESC');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET project by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project không tồn tại'
      });
    }
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE project
router.post('/', async (req, res) => {
  try {
    const { 
      id, name, customer, customerPhone, adminUrl, adminUsername, adminPassword, 
      status, description, price, createdAt 
    } = req.body;
    
    await pool.query(
      `INSERT INTO projects (id, name, customer, customerPhone, adminUrl, adminUsername, adminPassword, status, description, price, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, name, customer, customerPhone, adminUrl, adminUsername, adminPassword, 
        status || 'planning', description, price || 0, createdAt || new Date()
      ]
    );

    res.json({
      success: true,
      data: req.body,
      message: 'Project đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, customer, customerPhone, adminUrl, adminUsername, adminPassword, 
      status, description, price 
    } = req.body;
    
    const [result] = await pool.query(
      `UPDATE projects 
       SET name = ?, customer = ?, customerPhone = ?, adminUrl = ?, adminUsername = ?, 
           adminPassword = ?, status = ?, description = ?, price = ?
       WHERE id = ?`,
      [name, customer, customerPhone, adminUrl, adminUsername, adminPassword, status, description, price, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project không tồn tại'
      });
    }

    res.json({
      success: true,
      data: req.body,
      message: 'Project đã được cập nhật'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Project đã được xóa'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
