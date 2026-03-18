const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all logs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 1000');
    
    // Parse JSON fields
    const logs = rows.map(log => ({
      ...log,
      old_data: log.old_data ? JSON.parse(log.old_data) : null,
      new_data: log.new_data ? JSON.parse(log.new_data) : null
    }));
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET log by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM logs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Log không tồn tại'
      });
    }
    
    const log = {
      ...rows[0],
      old_data: rows[0].old_data ? JSON.parse(rows[0].old_data) : null,
      new_data: rows[0].new_data ? JSON.parse(rows[0].new_data) : null
    };
    
    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Error getting log:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE log
router.post('/', async (req, res) => {
  try {
    const { id, action_type, module_name, item_id, item_name, old_data, new_data, user, created_at } = req.body;
    
    await pool.query(
      `INSERT INTO logs (id, action_type, module_name, item_id, item_name, old_data, new_data, user, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        action_type, 
        module_name, 
        item_id, 
        item_name, 
        old_data ? JSON.stringify(old_data) : null,
        new_data ? JSON.stringify(new_data) : null,
        user || 'quydev',
        created_at || new Date()
      ]
    );

    res.json({
      success: true,
      data: req.body,
      message: 'Log đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE log
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM logs WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Log không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Log đã được xóa'
    });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// BULK DELETE logs
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Danh sách IDs không hợp lệ'
      });
    }

    const placeholders = ids.map(() => '?').join(',');
    const [result] = await pool.query(
      `DELETE FROM logs WHERE id IN (${placeholders})`,
      ids
    );

    res.json({
      success: true,
      message: `Đã xóa ${result.affectedRows} log(s)`,
      deletedCount: result.affectedRows
    });
  } catch (error) {
    console.error('Error bulk deleting logs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET logs by module
router.get('/module/:moduleName', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM logs WHERE module_name = ? ORDER BY created_at DESC LIMIT 500',
      [req.params.moduleName]
    );
    
    const logs = rows.map(log => ({
      ...log,
      old_data: log.old_data ? JSON.parse(log.old_data) : null,
      new_data: log.new_data ? JSON.parse(log.new_data) : null
    }));
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error getting logs by module:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
