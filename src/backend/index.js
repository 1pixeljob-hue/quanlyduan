const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Cho phép requests không có origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import routes
const hostingRoutes = require('./routes/hostings');
const projectRoutes = require('./routes/projects');
const passwordRoutes = require('./routes/passwords');
const categoryRoutes = require('./routes/categories');
const codexRoutes = require('./routes/codex');
const logRoutes = require('./routes/logs');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '1Pixel Backend API đang hoạt động',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'MySQL'
  });
});

// API Routes
app.use('/api/hostings', hostingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/codex', codexRoutes);
app.use('/api/logs', logRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint không tồn tại',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Lỗi server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Khởi động server
async function startServer() {
  try {
    // Khởi tạo database
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║                                                       ║');
      console.log('║          🦆 1PIXEL BACKEND API SERVER 🦆             ║');
      console.log('║                                                       ║');
      console.log('╚═══════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: MySQL`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log('');
      console.log('📋 Available Endpoints:');
      console.log('   GET  /api/health          - Health check');
      console.log('   CRUD /api/hostings        - Quản lý Hosting');
      console.log('   CRUD /api/projects        - Quản lý Project');
      console.log('   CRUD /api/passwords       - Quản lý Password');
      console.log('   CRUD /api/categories      - Quản lý Category');
      console.log('   CRUD /api/codex           - Quản lý Code Snippets');
      console.log('   CRUD /api/logs            - Quản lý Logs');
      console.log('');
      console.log('✅ Server sẵn sàng nhận requests!');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();
