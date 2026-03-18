# ✅ 1Pixel Deployment Checklist

Checklist để đảm bảo deployment thành công.

---

## 📋 Pre-Deployment

### Database Setup
- [ ] MySQL database đã được tạo trên hosting
- [ ] Database user với full privileges đã được tạo
- [ ] Đã test connection: `mysql -u user -p -h host database_name`
- [ ] Ghi lại thông tin:
  - DB_HOST: ________________
  - DB_USER: ________________
  - DB_PASSWORD: ________________
  - DB_NAME: ________________
  - DB_PORT: 3306

### Hosting Requirements
- [ ] Node.js >= 18.0.0 đã được cài đặt
- [ ] npm/yarn đã được cài đặt
- [ ] SSH access đã được verify
- [ ] PM2 hoặc process manager đã sẵn sàng
- [ ] FTP/SFTP credentials đã có
- [ ] Domain/subdomain đã được cấu hình DNS

---

## 🔧 Backend Deployment

### Code Upload
- [ ] Backend code đã upload lên server (Git hoặc FTP)
- [ ] Path: /home/username/1pixel/backend
- [ ] File `.env` đã được tạo với đúng thông tin
- [ ] Dependencies đã cài: `npm install --production`

### Environment Variables (`/backend/.env`)
- [ ] `DB_HOST` - MySQL host
- [ ] `DB_USER` - MySQL username
- [ ] `DB_PASSWORD` - MySQL password
- [ ] `DB_NAME` - Database name
- [ ] `DB_PORT` - MySQL port (3306)
- [ ] `PORT` - Backend port (3001)
- [ ] `NODE_ENV` - production
- [ ] `CORS_ORIGIN` - Frontend domains

### Start Backend
- [ ] PM2 đã được cài: `npm install -g pm2`
- [ ] Backend đã start: `pm2 start index.js --name "1pixel-backend"`
- [ ] PM2 config đã save: `pm2 save`
- [ ] Auto-start đã config: `pm2 startup`
- [ ] Backend status OK: `pm2 status`

### Verify Backend
- [ ] Health endpoint hoạt động: `curl http://localhost:3001/api/health`
- [ ] Database tables đã được tạo tự động
- [ ] Logs không có error: `pm2 logs 1pixel-backend`
- [ ] Backend URL ghi lại: ________________

---

## 💻 Frontend Deployment

### GitHub Repository
- [ ] GitHub repository đã được tạo
- [ ] Code đã push lên GitHub
- [ ] Branch `main` đã sẵn sàng
- [ ] File `.github/workflows/deploy.yml` đã tồn tại

### GitHub Secrets
Vào: **Settings** → **Secrets and variables** → **Actions**

- [ ] `VITE_API_URL` - Backend API URL
  - Value: `https://api.onetask.1pixel.vn/api`
- [ ] `FTP_SERVER` - FTP host
  - Value: `ftp.your-hosting.com`
- [ ] `FTP_USERNAME` - FTP username
  - Value: `username@domain.com`
- [ ] `FTP_PASSWORD` - FTP password
  - Value: `************`
- [ ] `FTP_SERVER_DIR` - Upload directory
  - Value: `/public_html/`

### Optional: SSH Deploy Secrets
- [ ] `SSH_HOST` - SSH host/IP
- [ ] `SSH_USERNAME` - SSH username
- [ ] `SSH_PRIVATE_KEY` - SSH private key
- [ ] `SSH_PORT` - SSH port (22)
- [ ] `BACKEND_PATH` - Backend path trên server

### Workflow Test
- [ ] Workflow file syntax đã check
- [ ] Test commit đã push: `git push origin main`
- [ ] GitHub Actions workflow đã chạy
- [ ] Build step thành công
- [ ] Deploy step thành công
- [ ] Không có error trong logs

---

## 🌐 Domain & DNS

### DNS Configuration
- [ ] A Record cho domain chính
  - Type: A
  - Name: @ hoặc www
  - Value: IP của hosting
  - TTL: 3600
- [ ] A Record cho API subdomain (nếu dùng)
  - Type: A
  - Name: api
  - Value: IP của hosting
  - TTL: 3600
- [ ] DNS đã propagate (check: `nslookup domain.com`)

### SSL Certificate
- [ ] SSL certificate đã được cài (Let's Encrypt/paid)
- [ ] HTTPS redirect đã được config
- [ ] Mixed content warnings không có
- [ ] Certificate auto-renewal đã setup

### Reverse Proxy (Nếu dùng subdomain cho API)
- [ ] Nginx/Apache config đã tạo
- [ ] Proxy pass đến `http://localhost:3001`
- [ ] Headers đã được forward đúng
- [ ] Nginx/Apache đã restart
- [ ] Test API subdomain: `curl https://api.domain.com/api/health`

---

## ✅ Post-Deployment Verification

### Backend Tests
- [ ] Health endpoint: `GET /api/health`
  ```bash
  curl https://api.onetask.1pixel.vn/api/health
  ```
- [ ] Get hostings: `GET /api/hostings`
- [ ] Create test hosting works
- [ ] Update test hosting works
- [ ] Delete test hosting works
- [ ] Logs được ghi lại

### Frontend Tests
- [ ] Website accessible: `https://onetask.1pixel.vn`
- [ ] Assets load correctly (CSS, JS, images)
- [ ] No console errors (F12)
- [ ] Login works: `quydev` / `Spencil@123`
- [ ] Dashboard loads data
- [ ] Debug Panel shows connection OK

### Module Tests
- [ ] **Hosting Module**
  - [ ] List hostings
  - [ ] Add new hosting
  - [ ] Edit hosting
  - [ ] Delete hosting
  - [ ] Search works
  - [ ] Filter by status works
- [ ] **Project Module**
  - [ ] List projects
  - [ ] Add new project
  - [ ] Edit project
  - [ ] Delete project
  - [ ] View project details
- [ ] **Password Module**
  - [ ] List passwords
  - [ ] Add new password
  - [ ] Edit password
  - [ ] Delete password
  - [ ] Show/hide password works
  - [ ] Copy to clipboard works
  - [ ] Category filter works
- [ ] **CodeX Module**
  - [ ] List code snippets
  - [ ] Add new snippet
  - [ ] Edit snippet
  - [ ] Delete snippet
  - [ ] Copy code works
  - [ ] Filter by language works
- [ ] **Logs Module**
  - [ ] View all logs
  - [ ] Filter by module
  - [ ] Delete single log
  - [ ] Bulk delete logs

### Google Calendar Integration (Optional)
- [ ] Google Calendar API credentials configured
- [ ] OAuth consent screen setup
- [ ] Test calendar connection in Settings
- [ ] Add hosting → Event created in calendar
- [ ] Update hosting → Event updated
- [ ] Delete hosting → Event deleted

### Performance
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] No memory leaks (check PM2 memory usage)
- [ ] Database queries optimized

---

## 🔄 Continuous Deployment

### GitHub Actions
- [ ] Workflow triggers on push to `main`
- [ ] Build completes successfully
- [ ] Deploy completes successfully
- [ ] Deployment notification works (if configured)
- [ ] Rollback strategy documented

### Monitoring
- [ ] PM2 monitoring setup
- [ ] Server resource monitoring (CPU, RAM, Disk)
- [ ] Error logging configured
- [ ] Uptime monitoring (optional)

---

## 📝 Documentation

### Internal Docs
- [ ] `.env.example` files up to date
- [ ] README.md updated with latest info
- [ ] API endpoints documented
- [ ] Deployment guide reviewed

### Team Knowledge
- [ ] Team knows how to deploy
- [ ] Emergency contacts documented
- [ ] Backup/restore procedure documented
- [ ] Rollback procedure documented

---

## 🔐 Security

### Environment Variables
- [ ] No `.env` files committed to Git
- [ ] All secrets in GitHub Secrets
- [ ] Production passwords are strong
- [ ] Database user has minimal necessary privileges

### Access Control
- [ ] SSH keys configured (no password auth)
- [ ] FTP access restricted to necessary IPs (optional)
- [ ] Database only accessible from localhost
- [ ] Admin credentials changed from default

### CORS
- [ ] CORS_ORIGIN set to correct domains only
- [ ] No wildcards in production

---

## 📊 Backup Strategy

### Database Backup
- [ ] Automated daily backup configured
- [ ] Backup location secured
- [ ] Restore procedure tested
- [ ] Retention policy defined

### Code Backup
- [ ] Code in GitHub (version control)
- [ ] Production `.env` backed up securely
- [ ] Server config backed up

---

## 🎯 Final Checklist

- [ ] ✅ Backend đang chạy stable
- [ ] ✅ Frontend accessible qua domain
- [ ] ✅ Database CRUD operations hoạt động
- [ ] ✅ Logs được ghi lại đầy đủ
- [ ] ✅ GitHub Actions auto-deploy hoạt động
- [ ] ✅ SSL certificate active
- [ ] ✅ Google Calendar sync hoạt động (nếu dùng)
- [ ] ✅ Team đã được training
- [ ] ✅ Monitoring đang active
- [ ] ✅ Backup strategy đã setup

---

## 📞 Support Contacts

### Hosting Provider
- Name: ________________
- Support Email: ________________
- Support Phone: ________________
- Control Panel: ________________

### Domain Registrar
- Name: ________________
- Support: ________________

### Team
- Developer: ________________
- DevOps: ________________
- Admin: quydev

---

## 🎉 Deployment Complete!

Nếu tất cả items trên đã được check ✅, congratulations! 

Hệ thống 1Pixel đã sẵn sàng cho production! 🚀

---

**Checklist Version:** 2.0.0  
**Last Updated:** 18/03/2026  
**Team:** 1Pixel
