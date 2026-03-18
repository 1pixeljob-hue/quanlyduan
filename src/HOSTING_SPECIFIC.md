# 🏢 Hướng Dẫn Deploy Theo Hosting Provider

## 📋 Danh Sách Hosting Phổ Biến

- [Hostinger](#hostinger)
- [cPanel Hosting](#cpanel-hosting)
- [DirectAdmin](#directadmin)
- [VPS Ubuntu/Debian](#vps-ubuntudebian)
- [DigitalOcean](#digitalocean)
- [AWS EC2](#aws-ec2)

---

## 🌐 Hostinger

### Setup MySQL
1. **Hepsia Control Panel → MySQL Databases**
2. **Create Database:**
   - Database name: `u123456789_1pixel`
   - Username: `u123456789_1pixel`
   - Password: [Auto-generated]
3. **Ghi nhớ:** Host thường là `localhost`

### Deploy Backend
```bash
# SSH vào Hostinger
ssh u123456789@123.hostinger.com

# Navigate to public_html
cd domains/yourdomain.com/public_html

# Clone repo
git clone https://github.com/your-username/1pixel.git
cd 1pixel/backend

# Setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# Configure .env
nano .env
```

**.env cho Hostinger:**
```env
NODE_ENV=production
PORT=3001

DB_HOST=localhost
DB_USER=u123456789_1pixel
DB_PASSWORD=your_auto_generated_password
DB_NAME=u123456789_1pixel
DB_PORT=3306

CORS_ORIGIN=https://yourdomain.com
```

```bash
# Start PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Nginx/Apache
- **Hostinger thường dùng Nginx**
- Setup reverse proxy qua Hepsia Panel:
  - Website → Advanced → Reverse Proxy
  - Path: `/api`
  - Target: `http://localhost:3001/api`

---

## 🎛️ cPanel Hosting

### Setup MySQL
1. **cPanel → MySQL Databases**
2. **Create New Database:**
   - Name: `cpanel_user_onepixel` (auto prefix)
3. **Create MySQL User:**
   - Username: `cpanel_user_1pixel`
   - Password: [Strong password]
4. **Add User to Database** → ALL PRIVILEGES

### Deploy Backend
```bash
# SSH hoặc Terminal trong cPanel
cd ~/public_html

# Clone repo
git clone https://github.com/your-username/1pixel.git
cd 1pixel/backend

# Setup Node.js version (nếu có Node Version Manager)
nvm install 18
nvm use 18

# Install và start
npm install --production
npm install -g pm2

pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### .htaccess Setup
```bash
# Copy .htaccess to document root
cp .htaccess.example ~/public_html/.htaccess
```

### Enable Node.js App
- **cPanel → Setup Node.js App**
  - Application root: `/home/cpanel_user/1pixel/backend`
  - Application startup file: `index.js`
  - Port: `3001`

---

## 🔧 DirectAdmin

### Setup MySQL
1. **DirectAdmin → MySQL Management**
2. **Create Database:**
   - Database: `admin_onepixel`
   - User: `admin_1pixel`
   - Password: [Strong password]

### Deploy Backend
```bash
ssh admin@your-server-ip
cd ~/domains/yourdomain.com/public_html

git clone https://github.com/your-username/1pixel.git
cd 1pixel/backend

# Setup
./scripts/setup.sh

# Configure .env
nano .env

# Start
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Apache Setup
```bash
# DirectAdmin thường dùng Apache
# Copy .htaccess
cp .htaccess.example ~/public_html/.htaccess

# Enable mod_proxy (nếu chưa có)
# Contact support để enable modules
```

---

## 🖥️ VPS Ubuntu/Debian

### Full Stack Setup

#### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install MySQL
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
```
```sql
CREATE DATABASE onepixel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'onepixel_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON onepixel_db.* TO 'onepixel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

#### 4. Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 5. Deploy Application
```bash
cd /var/www
sudo git clone https://github.com/your-username/1pixel.git
cd 1pixel/backend

# Set permissions
sudo chown -R $USER:$USER /var/www/1pixel

# Setup
./scripts/setup.sh
nano .env

# Install PM2
sudo npm install -g pm2

# Start backend
pm2 start ecosystem.config.js
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
pm2 save
```

#### 6. Configure Nginx
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/1pixel
sudo nano /etc/nginx/sites-available/1pixel
# Update domain và paths

sudo ln -s /etc/nginx/sites-available/1pixel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. Setup SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

#### 8. Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 🌊 DigitalOcean

### Create Droplet
1. **New Droplet → Ubuntu 22.04 LTS**
2. **Plan:** Basic ($6/month hoặc cao hơn)
3. **Add SSH Key**
4. **Create Droplet**

### Setup
```bash
# SSH vào droplet
ssh root@your-droplet-ip

# Create non-root user
adduser 1pixel
usermod -aG sudo 1pixel
su - 1pixel

# Follow VPS Ubuntu setup above
```

### DigitalOcean Managed Database (Optional)
- **Databases → Create → MySQL**
- **Copy connection details**
- **Update .env:**
```env
DB_HOST=your-db-cluster.db.ondigitalocean.com
DB_PORT=25060
DB_USER=doadmin
DB_PASSWORD=your_do_password
DB_NAME=onepixel_db
```

---

## ☁️ AWS EC2

### Launch Instance
1. **EC2 → Launch Instance**
2. **Ubuntu Server 22.04 LTS**
3. **Instance Type:** t2.micro (free tier) hoặc t2.small
4. **Configure Security Group:**
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (3001) - Localhost only

### Connect & Setup
```bash
# Download .pem key
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@ec2-xxx-xxx-xxx-xxx.compute.amazonaws.com

# Update system
sudo apt update && sudo apt upgrade -y

# Follow VPS Ubuntu setup
```

### AWS RDS MySQL (Optional)
1. **RDS → Create Database → MySQL**
2. **Free tier template**
3. **Copy endpoint và credentials**
4. **Update .env:**
```env
DB_HOST=your-db.xxxxx.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_rds_password
DB_NAME=onepixel_db
```

### Elastic IP (Recommended)
- **Allocate Elastic IP**
- **Associate với EC2 instance**
- **Update DNS records**

---

## 🔒 Security Best Practices

### Tất Cả Hosting Types

#### 1. SSH Security
```bash
# Đổi default SSH port
sudo nano /etc/ssh/sshd_config
# Port 2222

# Disable root login
# PermitRootLogin no

sudo systemctl restart sshd
```

#### 2. Fail2Ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

#### 3. MySQL Security
```bash
# Không dùng root user cho app
# Strong passwords
# Limit connections to localhost

# Trong .env
DB_HOST=localhost  # KHÔNG expose ra public
```

#### 4. Environment Variables
```bash
# Đảm bảo .env không commit
cat .gitignore | grep .env

# Permissions
chmod 600 backend/.env
```

#### 5. Regular Updates
```bash
# Cronjob for updates
sudo crontab -e

# Add:
0 2 * * 0 apt update && apt upgrade -y
0 3 * * * cd /path/to/1pixel/backend && ./scripts/backup-db.sh
```

---

## 📊 Performance Optimization

### PM2 Cluster Mode (cho VPS)
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: '1pixel-backend',
    script: 'index.js',
    instances: 'max',  // Cluster mode
    exec_mode: 'cluster',
    max_memory_restart: '500M'
  }]
}
```

### MySQL Tuning
```sql
-- Trong MySQL config
[mysqld]
innodb_buffer_pool_size = 256M
max_connections = 100
query_cache_size = 16M
```

### Nginx Caching
```nginx
# Thêm vào nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    # ...
}
```

---

## ✅ Checklist Theo Hosting

### Shared Hosting (cPanel/DirectAdmin)
- [ ] MySQL database created via panel
- [ ] Node.js app setup trong panel
- [ ] .htaccess configured
- [ ] PM2 hoặc panel's app manager
- [ ] Reverse proxy setup

### VPS/Cloud (DigitalOcean/AWS)
- [ ] Server provisioned
- [ ] MySQL installed và configured
- [ ] Node.js installed
- [ ] Nginx/Apache installed
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] PM2 startup enabled
- [ ] Backup automation

---

**Need help?** Check provider-specific documentation hoặc contact support.
