// API Base URL - Uses environment variable with fallback to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const headers = {
  'Content-Type': 'application/json',
};

// ==================== HOSTING API ====================

export const hostingApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/hostings`, { headers });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  create: async (hosting: any) => {
    const response = await fetch(`${API_BASE}/hostings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(hosting)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  update: async (id: string, hosting: any) => {
    const response = await fetch(`${API_BASE}/hostings/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(hosting)
    });
    if (!response.ok) {
      const text = await response.text();
      console.error('Update hosting failed:', response.status, text);
      throw new Error(`Không thể cập nhật hosting: ${response.status} - ${text}`);
    }
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Unknown error');
    return result.data;
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/hostings/${id}`, {
      method: 'DELETE',
      headers
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }
};

// ==================== PROJECT API ====================

export const projectApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/projects`, { headers });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  create: async (project: any) => {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(project)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  update: async (id: string, project: any) => {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(project)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }
};

// ==================== PASSWORD API ====================

export const passwordApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/passwords`, { headers });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  create: async (password: any) => {
    const response = await fetch(`${API_BASE}/passwords`, {
      method: 'POST',
      headers,
      body: JSON.stringify(password)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  update: async (id: string, password: any) => {
    const response = await fetch(`${API_BASE}/passwords/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(password)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/passwords/${id}`, {
      method: 'DELETE',
      headers
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }
};

// ==================== CATEGORY API ====================

export const categoryApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/categories`, { headers });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  create: async (category: any) => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(category)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  update: async (id: string, category: any) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(category)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }
};

// ==================== CODEX API ====================

export const codexApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/codex`, { headers });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  create: async (codexItem: any) => {
    const response = await fetch(`${API_BASE}/codex`, {
      method: 'POST',
      headers,
      body: JSON.stringify(codexItem)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  update: async (id: string, codexItem: any) => {
    const response = await fetch(`${API_BASE}/codex/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(codexItem)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/codex/${id}`, {
      method: 'DELETE',
      headers
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }
};

// ==================== LOG API ====================

export const logApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE}/logs`, { headers });
      
      // Check if response is ok
      if (!response.ok) {
        console.error('Log API response not OK:', response.status, response.statusText);
        // Return empty array if endpoint doesn't exist yet
        if (response.status === 404 || response.status === 500) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      // Check if response is empty
      if (!text) {
        return [];
      }
      
      // Try to parse JSON
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse logs response:', text);
        return [];
      }
      
      if (!result.success) throw new Error(result.error);
      return result.data || [];
    } catch (error) {
      console.error('Error in logApi.getAll:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  },
  
  create: async (log: any) => {
    try {
      const response = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers,
        body: JSON.stringify(log)
      });
      
      if (!response.ok) {
        console.error('Failed to create log:', response.status);
        return null;
      }
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error in logApi.create:', error);
      // Don't throw - just log the error
      return null;
    }
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/logs/${id}`, {
      method: 'DELETE',
      headers
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  },
  
  deleteMany: async (ids: string[]) => {
    const response = await fetch(`${API_BASE}/logs/bulk-delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ids })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }
};

// ==================== HEALTH CHECK API ====================

export const healthApi = {
  check: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};