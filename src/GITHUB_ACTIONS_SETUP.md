# 🚀 Hướng Dẫn Setup GitHub Actions Auto-Deploy

Guide này hướng dẫn cách cấu hình GitHub Actions để tự động deploy 1Pixel lên hosting mỗi khi có commit mới.

---

## 📋 Yêu Cầu

- ✅ GitHub Repository
- ✅ Hosting có hỗ trợ FTP/SFTP hoặc SSH
- ✅ Backend đã được deploy và chạy ổn định
- ✅ Biết thông tin FTP/SSH của hosting

---

## 🔧 Bước 1: Chuẩn Bị GitHub Repository

### 1.1. Tạo/Push Code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add remote repository
git remote add origin https://github.com/yourusername/1pixel.git

# Add và commit code
git add .
git commit -m "Initial commit - 1Pixel System"

# Push lên GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Bước 2: Thêm Secrets vào GitHub

Secrets là biến môi trường bảo mật, không bị lộ trong logs.

### 2.1. Truy cập Settings

1. Vào GitHub repository
2. Click **Settings** (tab trên cùng)
3. Sidebar bên trái: **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2.2. Thêm Secrets Cần Thiết

#### Secrets cho Frontend Deploy (FTP)

| Secret Name | Giá Trị | Ví Dụ |
|------------|---------|-------|
| `VITE_API_URL` | Backend API URL | `https://api.onetask.1pixel.vn/api` |
| `FTP_SERVER` | FTP host | `ftp.your-hosting.com` |
| `FTP_USERNAME` | FTP username | `username@yourdomain.com` |
| `FTP_PASSWORD` | FTP password | `your_ftp_password` |
| `FTP_SERVER_DIR` | Thư mục trên server | `/public_html/` hoặc `/domains/onetask.1pixel.vn/public_html/` |

#### Secrets cho Backend Deploy (SSH - Optional)

| Secret Name | Giá Trị | Ví Dụ |
|------------|---------|-------|
| `SSH_HOST` | SSH host/IP | `123.45.67.89` hoặc `ssh.your-hosting.com` |
| `SSH_USERNAME` | SSH username | `username` |
| `SSH_PRIVATE_KEY` | SSH private key | (Nội dung file `~/.ssh/id_rsa`) |
| `SSH_PORT` | SSH port | `22` (mặc định) |
| `BACKEND_PATH` | Đường dẫn backend trên server | `/home/username/1pixel/backend` |

### 2.3. Tạo SSH Key (nếu dùng SSH Deploy)

Trên máy local:

```bash
# Tạo SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@1pixel"

# Lưu tại: /Users/yourname/.ssh/id_rsa_1pixel

# Copy public key lên server
ssh-copy-id -i ~/.ssh/id_rsa_1pixel.pub username@your-server.com

# Copy PRIVATE key để thêm vào GitHub Secret
cat ~/.ssh/id_rsa_1pixel
# Copy toàn bộ nội dung (bao gồm -----BEGIN ... END-----)
```

Paste private key vào Secret `SSH_PRIVATE_KEY`.

---

## 📄 Bước 3: Tạo Workflow File

File `.github/workflows/deploy.yml` đã được tạo sẵn trong project.

### Kiểm tra workflow:

```bash
cat .github/workflows/deploy.yml
```

### Giải thích các job:

#### Job 1: `build-and-deploy-frontend`
- Chạy mỗi khi push code lên branch `main`
- Build frontend với `VITE_API_URL`
- Deploy file build lên hosting qua FTP

#### Job 2: `deploy-backend` (Optional)
- Chỉ chạy khi commit message có `[deploy-backend]`
- SSH vào server, pull code mới, restart backend

---

## 🎯 Bước 4: Test Auto-Deploy

### 4.1. Deploy Frontend

```bash
# Thay đổi code
echo "Test deploy" >> README.md

# Commit và push
git add .
git commit -m "Test GitHub Actions deploy"
git push origin main
```

### 4.2. Theo Dõi Workflow

1. Vào GitHub repository
2. Click tab **Actions**
3. Xem workflow đang chạy
4. Click vào run để xem chi tiết logs

### 4.3. Deploy Backend (Optional)

```bash
# Commit với message đặc biệt
git commit -m "Update backend API [deploy-backend]"
git push origin main
```

Workflow sẽ:
1. Deploy frontend
2. Deploy backend (vì có `[deploy-backend]` trong message)

---

## 🔄 Workflow Deploy

```
Developer → git push origin main
                ↓
         GitHub Actions Trigger
                ↓
    ┌──────────────────────────┐
    │  Build Frontend          │
    │  - npm ci                │
    │  - npm run build         │
    │  - Apply VITE_API_URL    │
    └──────────────────────────┘
                ↓
    ┌──────────────────────────┐
    │  Deploy via FTP          │
    │  - Upload /dist/*        │
    │  - To hosting            │
    └──────────────────────────┘
                ↓
    [Optional: Backend Deploy]
                ↓
           ✅ Success!
```

---

## 🐛 Troubleshooting

### 1. Workflow thất bại - FTP Error

**Lỗi**:
```
Error: FTP connection failed
```

**Giải pháp**:
- Kiểm tra `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- Thử FTP login thủ công bằng FileZilla
- Verify port FTP (thường là 21)

### 2. Workflow thất bại - SSH Error

**Lỗi**:
```
Permission denied (publickey)
```

**Giải pháp**:
- Verify SSH_PRIVATE_KEY đã paste đúng (bao gồm header/footer)
- Check SSH_USERNAME và SSH_HOST
- Test SSH manual: `ssh -i ~/.ssh/key username@host`

### 3. Build thất bại

**Lỗi**:
```
Error: Cannot find module 'xyz'
```

**Giải pháp**:
- Chạy local: `npm ci && npm run build`
- Fix lỗi local trước khi push
- Check `package.json` dependencies

### 4. Frontend deploy nhưng blank page

**Nguyên nhân**: Thiếu hoặc sai `VITE_API_URL`

**Giải pháp**:
- Verify Secret `VITE_API_URL` đã được set
- Check browser console xem lỗi gì
- Test backend health: `curl https://api-url/api/health`

---

## 📊 Monitoring Deployments

### View Workflow History

```
GitHub → Your Repo → Actions Tab
```

Mỗi push sẽ có 1 workflow run với:
- ✅ Success: Deploy thành công
- ❌ Failed: Có lỗi, click vào xem logs
- 🟡 In Progress: Đang deploy

### Logs Locations

**Frontend Deploy Logs**:
- GitHub Actions → Run Details → build-and-deploy-frontend

**Backend Logs** (trên server):
```bash
pm2 logs 1pixel-backend
```

---

## 🎨 Customization

### Deploy multiple branches

Sửa file `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
      - develop  # Thêm branch develop
```

### Deploy vào thư mục khác nhau

Tạo secrets riêng cho từng branch:
- `FTP_SERVER_DIR_MAIN`: `/public_html/`
- `FTP_SERVER_DIR_DEV`: `/public_html/dev/`

Sửa workflow:
```yaml
server-dir: ${{ github.ref == 'refs/heads/main' && secrets.FTP_SERVER_DIR_MAIN || secrets.FTP_SERVER_DIR_DEV }}
```

### Thêm notification

Thêm step gửi notification qua Slack/Discord khi deploy xong:

```yaml
- name: 📢 Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deploy to production completed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## ✅ Checklist Setup

- [ ] GitHub repository đã được tạo
- [ ] Code đã được push lên GitHub
- [ ] Secrets đã được thêm vào GitHub
  - [ ] `VITE_API_URL`
  - [ ] `FTP_SERVER`
  - [ ] `FTP_USERNAME`
  - [ ] `FTP_PASSWORD`
  - [ ] `FTP_SERVER_DIR`
  - [ ] (Optional) SSH secrets
- [ ] File `.github/workflows/deploy.yml` đã tồn tại
- [ ] Test workflow đã chạy thành công
- [ ] Frontend đã deploy lên hosting
- [ ] Truy cập website và verify hoạt động bình thường

---

## 📝 Best Practices

1. **Commit Messages**: Rõ ràng và có ý nghĩa
   ```
   ✅ "Fix: Sửa lỗi hiển thị dashboard"
   ✅ "Feature: Thêm module quản lý invoice"
   ❌ "update"
   ```

2. **Test Local First**: Luôn test local trước khi push
   ```bash
   npm run build
   # Verify build thành công
   ```

3. **Environment Variables**: Dùng Secrets cho thông tin nhạy cảm
   - ✅ API URLs
   - ✅ Passwords
   - ✅ SSH Keys
   - ❌ KHÔNG hardcode trong code

4. **Branch Protection**: Protect branch `main`
   - GitHub Settings → Branches → Add rule
   - Require pull request reviews
   - Require status checks to pass

5. **Rollback**: Nếu deploy lỗi
   ```bash
   # Revert commit cuối
   git revert HEAD
   git push origin main
   # Workflow sẽ tự deploy lại version cũ
   ```

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Workflow Logs**: GitHub Actions → Run details
2. **Verify Secrets**: Settings → Secrets and variables → Actions
3. **Test FTP/SSH Manual**: Dùng FileZilla hoặc SSH client
4. **Check Backend**: `curl https://api-url/api/health`
5. **Browser Console**: F12 → Console tab để xem lỗi frontend

---

**Version**: 2.0.0  
**Date**: 18/03/2026  
**Team**: 1Pixel  
**CI/CD**: GitHub Actions
