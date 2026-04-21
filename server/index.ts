import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createPixCharge, getPixStatus, receivePixWebhook } from "./pix.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  app.post("/api/pix/checkout", async (req, res) => {
    try {
      const result = await createPixCharge(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      console.error("Erro ao gerar Pix:", error);
      res.status(500).json({ message: "Não foi possível gerar o Pix agora." });
    }
  });

  app.post("/api/pix/create", async (req, res) => {
    try {
      const result = await createPixCharge(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      console.error("Erro ao criar Pix:", error);
      res.status(500).json({ message: "Não foi possível gerar o Pix agora." });
    }
  });

  app.get("/api/pix/status", async (req, res) => {
    try {
      const transactionId =
        typeof req.query.transactionId === "string"
          ? req.query.transactionId
          : undefined;
      const result = await getPixStatus(transactionId);
      res.status(result.status).json(result.body);
    } catch (error) {
      console.error("Erro ao consultar status do Pix:", error);
      res.status(500).json({ message: "Não foi possível consultar o status do Pix." });
    }
  });

  app.post("/api/pix/webhook", async (req, res) => {
    try {
      const result = await receivePixWebhook({
        event: req.body?.event,
        transactionId: req.body?.transactionId,
        status: req.body?.status,
        raw: req.body,
      });
      res.status(result.status).json(result.body);
    } catch (error) {
      console.error("Erro ao processar webhook Pix:", error);
      res.status(500).json({ message: "Não foi possível processar o webhook Pix." });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
