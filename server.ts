import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { handleWhatsAppWebhook, verifyWhatsAppWebhook } from "./server/whatsappHandler";
import { registerUser, loginUser, updateProfile } from "./server/authHandler";
import { getUserStats, getQuestionHistory, getPaymentHistory, purchasePlan } from "./server/apiHandler";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // WhatsApp Webhook Routes
  app.get("/api/webhook/whatsapp", verifyWhatsAppWebhook);
  app.post("/api/webhook/whatsapp", handleWhatsAppWebhook);

  // Auth Routes
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.put("/api/auth/profile", updateProfile);

  // App API Routes
  app.get("/api/user/stats", getUserStats);
  app.get("/api/user/questions", getQuestionHistory);
  app.get("/api/user/payments", getPaymentHistory);
  app.post("/api/payments/purchase", purchasePlan);

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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
