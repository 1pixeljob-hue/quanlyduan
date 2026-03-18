// PM2 Ecosystem Configuration for 1Pixel Backend

module.exports = {
  apps: [{
    name: '1pixel-backend',
    script: 'index.js',
    
    // Instances
    instances: 1,
    exec_mode: 'fork',
    
    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    
    // Logs
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced features
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    
    // Restart delay
    restart_delay: 4000,
    min_uptime: '10s',
    max_restarts: 10,
    
    // Kill timeout
    kill_timeout: 5000,
    
    // Monitoring
    instance_var: 'INSTANCE_ID',
    
    // Source map support
    source_map_support: false,
    
    // Disable automation features
    automation: false,
    
    // Merge logs
    merge_logs: true,
    
    // Time zone
    time: true
  }]
};
