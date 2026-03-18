const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onepixel_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection và tạo database nếu chưa có
async function initializeDatabase() {
  let connection;
  try {
    // Kết nối không cần database để tạo database
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    connection = await tempPool.getConnection();
    
    // Tạo database nếu chưa tồn tại
    const dbName = process.env.DB_NAME || 'onepixel_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' đã sẵn sàng`);
    
    connection.release();
    await tempPool.end();

    // Kết nối với database và tạo tables
    const mainConnection = await pool.getConnection();
    await createTables(mainConnection);
    mainConnection.release();

    console.log('✅ MySQL Database connected và tables đã được tạo');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Tạo các bảng cần thiết
async function createTables(connection) {
  try {
    // Bảng hostings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hostings (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        registrationDate DATE NOT NULL,
        expirationDate DATE NOT NULL,
        price DECIMAL(15, 2) DEFAULT 0,
        status ENUM('active', 'expiring', 'expired') DEFAULT 'active',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_expiration (expirationDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Bảng projects
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        customer VARCHAR(255) NOT NULL,
        customerPhone VARCHAR(50),
        adminUrl TEXT,
        adminUsername VARCHAR(255),
        adminPassword VARCHAR(255),
        status ENUM('planning', 'in-progress', 'completed', 'on-hold', 'pending-acceptance') DEFAULT 'planning',
        description TEXT,
        price DECIMAL(15, 2) DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_customer (customer)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Bảng passwords
    await connection.query(`
      CREATE TABLE IF NOT EXISTS passwords (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        username VARCHAR(255),
        password TEXT,
        website TEXT,
        notes TEXT,
        category VARCHAR(255) DEFAULT 'uncategorized',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Bảng categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(7) DEFAULT '#6B7280',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Bảng codex (code snippets)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS codex (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'javascript',
        content TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Bảng logs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id VARCHAR(255) PRIMARY KEY,
        action_type ENUM('create', 'update', 'delete') NOT NULL,
        module_name VARCHAR(100) NOT NULL,
        item_id VARCHAR(255),
        item_name VARCHAR(255),
        old_data JSON,
        new_data JSON,
        user VARCHAR(100) DEFAULT 'quydev',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_module (module_name),
        INDEX idx_action (action_type),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tất cả tables đã được tạo thành công');

    // Thêm default category nếu chưa có
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    if (categories[0].count === 0) {
      await connection.query(`
        INSERT INTO categories (id, name, color)
        VALUES ('uncategorized', 'Chưa Phân Loại', '#6B7280')
      `);
      console.log('✅ Đã tạo category mặc định');
    }

  } catch (error) {
    console.error('❌ Lỗi khi tạo tables:', error.message);
    throw error;
  }
}

// Export pool và hàm khởi tạo
module.exports = {
  pool,
  initializeDatabase
};
