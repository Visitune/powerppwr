import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { runExtraction } from "./lib/extractLlm.js";

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "10mb" }));

// AI-assisted extraction route (optional, used when requested by user for complex supplier PDFs)
app.post("/api/extract-llm", async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { status, body } = await runExtraction(req.body, ip);
  return res.status(status).json(body);
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(import.meta.dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`powerPPWR server running on http://localhost:${PORT}`);
  });
}

startServer();
