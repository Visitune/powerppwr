// Vercel serverless function: POST /api/extract-llm
// Same logic as the Express route in server.ts (shared in lib/extractLlm.ts).
import { runExtraction } from "../lib/extractLlm.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const forwarded = req.headers?.["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : String(forwarded || "")).split(",")[0].trim()
    || req.socket?.remoteAddress
    || "unknown";
  const { status, body } = await runExtraction(req.body, ip);
  return res.status(status).json(body);
}
