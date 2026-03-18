-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete')),
  module_name TEXT NOT NULL CHECK (module_name IN ('hosting', 'project', 'password', 'codex')),
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS logs_module_name_idx ON logs(module_name);
CREATE INDEX IF NOT EXISTS logs_action_type_idx ON logs(action_type);
CREATE INDEX IF NOT EXISTS logs_created_at_idx ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS logs_item_id_idx ON logs(item_id);
