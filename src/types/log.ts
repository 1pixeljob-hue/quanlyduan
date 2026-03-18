export interface Log {
  id: string;
  action_type: 'create' | 'update' | 'delete';
  module_name: 'hosting' | 'project' | 'password' | 'codex';
  item_id: string;
  item_name: string;
  old_data: any;
  new_data: any;
  user: string;
  created_at: string;
}

export interface CreateLogData {
  action_type: 'create' | 'update' | 'delete';
  module_name: 'hosting' | 'project' | 'password' | 'codex';
  item_id: string;
  item_name: string;
  old_data?: any;
  new_data?: any;
  user?: string;
}
