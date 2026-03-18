import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import cron from "./cron.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c138835e/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== HOSTING ROUTES ====================

// Get all hostings
app.get("/make-server-c138835e/hostings", async (c) => {
  try {
    const hostings = await kv.getByPrefix("hosting:");
    return c.json({ success: true, data: hostings });
  } catch (error) {
    console.error("Error fetching hostings:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create hosting
app.post("/make-server-c138835e/hostings", async (c) => {
  try {
    const hosting = await c.req.json();
    const key = `hosting:${hosting.id}`;
    await kv.set(key, hosting);
    return c.json({ success: true, data: hosting });
  } catch (error) {
    console.error("Error creating hosting:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update hosting
app.put("/make-server-c138835e/hostings/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const hosting = await c.req.json();
    const key = `hosting:${id}`;
    await kv.set(key, hosting);
    return c.json({ success: true, data: hosting });
  } catch (error) {
    console.error("Error updating hosting:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete hosting
app.delete("/make-server-c138835e/hostings/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `hosting:${id}`;
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting hosting:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== PROJECT ROUTES ====================

// Get all projects
app.get("/make-server-c138835e/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    return c.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create project
app.post("/make-server-c138835e/projects", async (c) => {
  try {
    const project = await c.req.json();
    const key = `project:${project.id}`;
    await kv.set(key, project);
    return c.json({ success: true, data: project });
  } catch (error) {
    console.error("Error creating project:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update project
app.put("/make-server-c138835e/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await c.req.json();
    const key = `project:${id}`;
    await kv.set(key, project);
    return c.json({ success: true, data: project });
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete project
app.delete("/make-server-c138835e/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `project:${id}`;
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== PASSWORD ROUTES ====================

// Get all passwords
app.get("/make-server-c138835e/passwords", async (c) => {
  try {
    const passwords = await kv.getByPrefix("password:");
    return c.json({ success: true, data: passwords });
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create password
app.post("/make-server-c138835e/passwords", async (c) => {
  try {
    const password = await c.req.json();
    const key = `password:${password.id}`;
    await kv.set(key, password);
    return c.json({ success: true, data: password });
  } catch (error) {
    console.error("Error creating password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update password
app.put("/make-server-c138835e/passwords/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const password = await c.req.json();
    const key = `password:${id}`;
    await kv.set(key, password);
    return c.json({ success: true, data: password });
  } catch (error) {
    console.error("Error updating password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete password
app.delete("/make-server-c138835e/passwords/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `password:${id}`;
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== CATEGORY ROUTES ====================

// Get all categories
app.get("/make-server-c138835e/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    return c.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create category
app.post("/make-server-c138835e/categories", async (c) => {
  try {
    const category = await c.req.json();
    const key = `category:${category.id}`;
    await kv.set(key, category);
    return c.json({ success: true, data: category });
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update category
app.put("/make-server-c138835e/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const category = await c.req.json();
    const key = `category:${id}`;
    await kv.set(key, category);
    return c.json({ success: true, data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete category
app.delete("/make-server-c138835e/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `category:${id}`;
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== CODEX ROUTES ====================

// Get all codex items
app.get("/make-server-c138835e/codex", async (c) => {
  try {
    const codexItems = await kv.getByPrefix("codex:");
    return c.json({ success: true, data: codexItems });
  } catch (error) {
    console.error("Error fetching codex items:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create codex item
app.post("/make-server-c138835e/codex", async (c) => {
  try {
    const codexItem = await c.req.json();
    const key = `codex:${codexItem.id}`;
    await kv.set(key, codexItem);
    return c.json({ success: true, data: codexItem });
  } catch (error) {
    console.error("Error creating codex item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update codex item
app.put("/make-server-c138835e/codex/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const codexItem = await c.req.json();
    const key = `codex:${id}`;
    await kv.set(key, codexItem);
    return c.json({ success: true, data: codexItem });
  } catch (error) {
    console.error("Error updating codex item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete codex item
app.delete("/make-server-c138835e/codex/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `codex:${id}`;
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting codex item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== LOG ROUTES ====================

// Get all logs
app.get("/make-server-c138835e/logs", async (c) => {
  try {
    const logs = await kv.getByPrefix("log:");
    return c.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create log
app.post("/make-server-c138835e/logs", async (c) => {
  try {
    const log = await c.req.json();
    // Ensure created_at is set
    if (!log.created_at) {
      log.created_at = new Date().toISOString();
    }
    
    // Get all current logs to check count
    const allLogs = await kv.getByPrefix("log:");
    
    // If we have 200 or more logs, delete the oldest ones
    if (allLogs.length >= 200) {
      // Sort logs by created_at ascending (oldest first)
      const sortedLogs = allLogs.sort((a: any, b: any) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      // Calculate how many logs to delete (keep only 199 to make room for the new one)
      const logsToDelete = sortedLogs.slice(0, allLogs.length - 199);
      
      // Delete the oldest logs
      for (const oldLog of logsToDelete) {
        const key = `log:${oldLog.id}`;
        await kv.del(key);
      }
      
      console.log(`Deleted ${logsToDelete.length} old logs to maintain 200 logs limit`);
    }
    
    // Now create the new log
    const key = `log:${log.id}`;
    await kv.set(key, log);
    return c.json({ success: true, data: log });
  } catch (error) {
    console.error("Error creating log:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete log
app.delete("/make-server-c138835e/logs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `log:${id}`;
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting log:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Bulk delete logs
app.post("/make-server-c138835e/logs/bulk-delete", async (c) => {
  try {
    const { ids } = await c.req.json();
    if (!Array.isArray(ids)) {
      return c.json({ success: false, error: "ids must be an array" }, 400);
    }
    
    for (const id of ids) {
      const key = `log:${id}`;
      await kv.del(key);
    }
    
    return c.json({ success: true, message: `Deleted ${ids.length} logs` });
  } catch (error) {
    console.error("Error bulk deleting logs:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== MIGRATION ROUTE ====================

// Migrate data from localStorage to Supabase
app.post("/make-server-c138835e/migrate", async (c) => {
  try {
    const { hostings, projects, passwords, categories, codexItems } = await c.req.json();
    
    // Migrate hostings
    if (hostings && Array.isArray(hostings)) {
      for (const hosting of hostings) {
        await kv.set(`hosting:${hosting.id}`, hosting);
      }
    }
    
    // Migrate projects
    if (projects && Array.isArray(projects)) {
      for (const project of projects) {
        await kv.set(`project:${project.id}`, project);
      }
    }
    
    // Migrate passwords
    if (passwords && Array.isArray(passwords)) {
      for (const password of passwords) {
        await kv.set(`password:${password.id}`, password);
      }
    }
    
    // Migrate categories
    if (categories && Array.isArray(categories)) {
      for (const category of categories) {
        await kv.set(`category:${category.id}`, category);
      }
    }
    
    // Migrate codex items
    if (codexItems && Array.isArray(codexItems)) {
      for (const codexItem of codexItems) {
        await kv.set(`codex:${codexItem.id}`, codexItem);
      }
    }
    
    return c.json({ 
      success: true, 
      message: "Migration completed successfully",
      migrated: {
        hostings: hostings?.length || 0,
        projects: projects?.length || 0,
        passwords: passwords?.length || 0,
        categories: categories?.length || 0,
        codexItems: codexItems?.length || 0
      }
    });
  } catch (error) {
    console.error("Error during migration:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== EMAIL & CRON ROUTES ====================

// Mount cron routes
app.route("/make-server-c138835e/cron", cron);

// Save email settings
app.post("/make-server-c138835e/email-settings", async (c) => {
  try {
    const settings = await c.req.json();
    await kv.set('email_settings', settings);
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error saving email settings:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get email settings
app.get("/make-server-c138835e/email-settings", async (c) => {
  try {
    const settings = await kv.get('email_settings');
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);