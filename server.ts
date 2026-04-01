import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { handleWhatsAppWebhook, verifyWhatsAppWebhook } from "./server/whatsappHandler";

async function startServer() {
  const app = express();
  // Use process.env.PORT for Render, fallback to 3000 for local/AI Studio
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(cors());
  app.use(express.json());

  // Ensure solutions directory exists and serve it statically
  const solutionsDir = path.join(process.cwd(), "solutions");
  if (!fs.existsSync(solutionsDir)) {
    fs.mkdirSync(solutionsDir);
  }
  app.use("/solutions", express.static(solutionsDir));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/system-health", (req, res) => {
    const memoryUsage = process.memoryUsage();
    
    // Format uptime
    const uptimeSeconds = Math.floor(process.uptime());
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    let uptimeStr = "";
    if (days > 0) uptimeStr += `${days}g `;
    if (hours > 0) uptimeStr += `${hours}s `;
    if (minutes > 0) uptimeStr += `${minutes}d `;
    uptimeStr += `${seconds}sn`;

    res.json({
      status: "Online",
      uptime: uptimeStr,
      memoryRss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      webhookActive: !!process.env.WHATSAPP_VERIFY_TOKEN
    });
  });

  // WhatsApp Webhook Routes
  app.get("/api/webhook/whatsapp", verifyWhatsAppWebhook);
  app.post("/api/webhook/whatsapp", handleWhatsAppWebhook);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
