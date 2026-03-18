-- ==========================================
-- HỆ THỐNG QUẢN LÝ CÔNG VIỆC TẬP TRUNG
-- Database Setup Script for Supabase
-- ==========================================

-- Xóa các bảng cũ nếu tồn tại (để reset database)
-- CẢNH BÁO: Uncomment các dòng DROP TABLE nếu bạn muốn xóa dữ liệu cũ
-- DROP TABLE IF EXISTS logs CASCADE;
-- DROP TABLE IF EXISTS codex CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS passwords CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS hostings CASCADE;
-- DROP TABLE IF EXISTS kv_store_c138835e CASCADE;
-- DROP TABLE IF EXISTS email_settings CASCADE;

-- ==========================================
-- 1. KV STORE TABLE (Core Storage)
-- ==========================================
-- Bảng này được sử dụng để lưu trữ tất cả dữ liệu dưới dạng key-value
-- Backend đang sử dụng bảng này làm storage chính

CREATE TABLE IF NOT EXISTS kv_store_c138835e (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index để tìm kiếm theo prefix nhanh hơn
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_c138835e (key text_pattern_ops);

-- ==========================================
-- 2. HOSTINGS TABLE (Module Hosting)
-- ==========================================
CREATE TABLE IF NOT EXISTS hostings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  provider TEXT NOT NULL,
  registration_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'expiring', 'expired')) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hostings_status ON hostings(status);
CREATE INDEX IF NOT EXISTS idx_hostings_expiration ON hostings(expiration_date);
CREATE INDEX IF NOT EXISTS idx_hostings_name ON hostings(name);

-- ==========================================
-- 3. PROJECTS TABLE (Module Project)
-- ==========================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold', 'cancelled')) DEFAULT 'planning',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  budget NUMERIC(15,2),
  spent NUMERIC(15,2) DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  team_members JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

-- ==========================================
-- 4. PASSWORDS TABLE (Module Password Manager)
-- ==========================================
CREATE TABLE IF NOT EXISTS passwords (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  username TEXT,
  email TEXT,
  password TEXT NOT NULL,
  url TEXT,
  category_id TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_passwords_category ON passwords(category_id);
CREATE INDEX IF NOT EXISTS idx_passwords_title ON passwords(title);
CREATE INDEX IF NOT EXISTS idx_passwords_favorite ON passwords(is_favorite);

-- ==========================================
-- 5. CATEGORIES TABLE (For Password Manager)
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (id, name, color) VALUES
  ('email', 'Email', 'blue'),
  ('social', 'Social Media', 'pink'),
  ('hosting', 'Hosting', 'purple'),
  ('inet', 'Internet', 'green')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. CODEX TABLE (Module CodeX - Code Snippets)
-- ==========================================
CREATE TABLE IF NOT EXISTS codex (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  type TEXT CHECK (type IN ('snippet', 'function', 'component', 'utility', 'other')) DEFAULT 'snippet',
  tags JSONB DEFAULT '[]'::jsonb,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_codex_type ON codex(type);
CREATE INDEX IF NOT EXISTS idx_codex_language ON codex(language);
CREATE INDEX IF NOT EXISTS idx_codex_title ON codex(title);
CREATE INDEX IF NOT EXISTS idx_codex_favorite ON codex(is_favorite);
CREATE INDEX IF NOT EXISTS idx_codex_tags ON codex USING gin(tags);

-- ==========================================
-- 7. LOGS TABLE (Activity Logs)
-- ==========================================
CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete')),
  module_name TEXT NOT NULL CHECK (module_name IN ('hosting', 'project', 'password', 'category', 'codex', 'settings')),
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user TEXT NOT NULL DEFAULT 'quydev',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_module ON logs(module_name);
CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action_type);
CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_item ON logs(item_id);

-- ==========================================
-- 8. EMAIL SETTINGS TABLE (Email Configuration)
-- ==========================================
CREATE TABLE IF NOT EXISTS email_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_password TEXT,
  from_email TEXT,
  from_name TEXT,
  notification_emails JSONB DEFAULT '[]'::jsonb,
  enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 9. FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_hostings_updated_at ON hostings;
CREATE TRIGGER update_hostings_updated_at BEFORE UPDATE ON hostings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_passwords_updated_at ON passwords;
CREATE TRIGGER update_passwords_updated_at BEFORE UPDATE ON passwords
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_codex_updated_at ON codex;
CREATE TRIGGER update_codex_updated_at BEFORE UPDATE ON codex
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_c138835e;
CREATE TRIGGER update_kv_store_updated_at BEFORE UPDATE ON kv_store_c138835e
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 10. SAMPLE DATA (Optional - for testing)
-- ==========================================

-- Sample hosting data
-- INSERT INTO hostings (id, name, domain, provider, registration_date, expiration_date, price, status, notes) VALUES
--   ('host1', 'Website chính', 'example.com', 'Hostinger', '2024-01-01', '2025-01-01', 1500000, 'active', 'Hosting chính cho website công ty'),
--   ('host2', 'Blog', 'blog.example.com', 'Netlify', '2024-06-01', '2024-12-31', 0, 'expiring', 'Free tier sắp hết hạn')
-- ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 11. RLS POLICIES (Row Level Security)
-- ==========================================
-- Tạm thời tắt RLS vì đang dùng service role key
-- Nếu cần bật RLS trong tương lai:

-- ALTER TABLE kv_store_c138835e ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE hostings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE codex ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- HOÀN TẤT SETUP
-- ==========================================

-- Hiển thị thông tin các bảng đã tạo
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('kv_store_c138835e', 'hostings', 'projects', 'passwords', 'categories', 'codex', 'logs', 'email_settings')
ORDER BY table_name;

-- ==========================================
-- HƯỚNG DẪN SỬ DỤNG
-- ==========================================
-- 
-- 1. Truy cập Supabase Dashboard: https://supabase.com/dashboard
-- 2. Chọn project của bạn
-- 3. Vào SQL Editor (bên trái menu)
-- 4. Copy toàn bộ nội dung file này và paste vào editor
-- 5. Click "Run" để thực thi
-- 6. Kiểm tra Table Editor để xem các bảng đã được tạo
--
-- LƯU Ý:
-- - Hệ thống hiện đang sử dụng KV Store (kv_store_c138835e) làm storage chính
-- - Các bảng khác (hostings, projects, etc.) là optional để query và báo cáo
-- - Dữ liệu được lưu dưới dạng key-value trong bảng kv_store_c138835e
-- - Format key: "module:id" (vd: "hosting:123", "project:456")
--
-- ==========================================
