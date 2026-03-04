import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("ai_tools.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    rating INTEGER DEFAULT 0,
    usage_level TEXT CHECK(usage_level IN ('low', 'medium', 'high')),
    notes TEXT,
    category TEXT,
    tags TEXT, -- JSON array
    is_favorite INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    last_used_at DATETIME,
    display_order INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/tools", (req, res) => {
    const tools = db
      .prepare(
        "SELECT * FROM tools ORDER BY display_order ASC, created_at DESC",
      )
      .all();
    res.json(
      tools.map((t) => ({
        ...t,
        tags: JSON.parse(t.tags || "[]"),
        is_favorite: !!t.is_favorite,
      })),
    );
  });

  app.post("/api/tools", (req, res) => {
    const {
      id,
      name,
      url,
      description,
      logo_url,
      rating,
      usage_level,
      notes,
      category,
      tags,
      display_order,
    } = req.body;
    const stmt = db.prepare(`
      INSERT INTO tools (id, name, url, description, logo_url, rating, usage_level, notes, category, tags, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      name,
      url,
      description,
      logo_url,
      rating,
      usage_level,
      notes,
      category,
      JSON.stringify(tags),
      display_order,
    );
    res.status(201).json({ message: "Tool added" });
  });

  app.put("/api/tools/:id", (req, res) => {
    const { id } = req.params;
    const {
      name,
      url,
      description,
      logo_url,
      rating,
      usage_level,
      notes,
      category,
      tags,
      is_favorite,
      display_order,
    } = req.body;
    const stmt = db.prepare(`
      UPDATE tools SET 
        name = ?, url = ?, description = ?, logo_url = ?, rating = ?, 
        usage_level = ?, notes = ?, category = ?, tags = ?, is_favorite = ?, display_order = ?
      WHERE id = ?
    `);
    stmt.run(
      name,
      url,
      description,
      logo_url,
      rating,
      usage_level,
      notes,
      category,
      JSON.stringify(tags),
      is_favorite ? 1 : 0,
      display_order,
      id,
    );
    res.json({ message: "Tool updated" });
  });

  app.delete("/api/tools/:id", (req, res) => {
    db.prepare("DELETE FROM tools WHERE id = ?").run(req.params.id);
    res.json({ message: "Tool deleted" });
  });

  app.post("/api/tools/:id/use", (req, res) => {
    db.prepare(
      "UPDATE tools SET usage_count = usage_count + 1, last_used_at = CURRENT_TIMESTAMP WHERE id = ?",
    ).run(req.params.id);
    res.json({ message: "Usage tracked" });
  });

  app.post("/api/tools/reorder", (req, res) => {
    const { orders } = req.body; // Array of { id, display_order }
    const updateStmt = db.prepare(
      "UPDATE tools SET display_order = ? WHERE id = ?",
    );
    const transaction = db.transaction((items) => {
      for (const item of items) updateStmt.run(item.display_order, item.id);
    });
    transaction(orders);
    res.json({ message: "Reordered" });
  });

  app.get("/api/stats", (req, res) => {
    const totalTools = db
      .prepare("SELECT COUNT(*) as count FROM tools")
      .get().count;
    const categoryStats = db
      .prepare(
        "SELECT category, COUNT(*) as count FROM tools GROUP BY category",
      )
      .all();
    const unusedToolsRaw = db
      .prepare(
        "SELECT * FROM tools WHERE last_used_at < date('now', '-30 days') OR last_used_at IS NULL",
      )
      .all();
    const topToolsRaw = db
      .prepare("SELECT * FROM tools ORDER BY usage_count DESC LIMIT 5")
      .all();

    const mapTool = (t: any) => ({
      ...t,
      tags: JSON.parse(t.tags || "[]"),
      is_favorite: !!t.is_favorite,
    });

    res.json({
      totalTools,
      categoryStats,
      unusedTools: unusedToolsRaw.map(mapTool),
      topTools: topToolsRaw.map(mapTool),
    });
  });

  app.post("/api/metadata", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res
          .status(500)
          .json({ error: "GEMINI_API_KEY not configured on server" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this URL: ${url}. 
      Return a JSON object with:
      - name: The name of the AI tool.
      - description: A short, catchy description (max 150 chars).
      - category: One of [Chat, Image, Video, Audio, Code, Writing, Productivity, Other].
      - tags: Array of 3 relevant tags.
      - logo_url: A likely favicon or logo URL (e.g. https://www.google.com/s2/favicons?sz=128&domain=${new URL(url).hostname}).
      
      Return ONLY the JSON.`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const metadata = JSON.parse(response.text || "{}");
      res.json(metadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      res.status(500).json({ error: "Failed to fetch metadata" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
