import cors from "cors";
import "dotenv/config";
import axios from "axios";
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

app.use(cors({
  origin: ["http://localhost:5173", "https://smart-agentt.netlify.app/"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje || typeof mensaje !== "string") {
    return res.status(400).json({ error: "El campo 'mensaje' es obligatorio." });
  }

  if (!N8N_WEBHOOK_URL) {
    return res.status(500).json({ error: "N8N_WEBHOOK_URL no está configurada." });
  }

  try {
    const response = await axios.post(N8N_WEBHOOK_URL, { input: mensaje});
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      const data = error.response?.data ?? { error: "Error al comunicarse con n8n." };
      return res.status(status).json(data);
    }

    return res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.post("/api/tickets", async (req, res) => {
  const { titulo, descripcion } = req.body;

  if (!titulo || typeof titulo !== "string") {
    return res.status(400).json({ error: "El campo 'titulo' es obligatorio." });
  }

  if (!descripcion || typeof descripcion !== "string") {
    return res.status(400).json({ error: "El campo 'descripcion' es obligatorio." });
  }

  try {
    const ticket = await prisma.ticket.create({
      data: { titulo, descripcion },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    return res.status(500).json({ error: "No se pudo guardar el ticket." });
  }
});

app.get("/api/tickets", async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        fechaCreacion: "desc", 
      },
    });
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    return res.status(500).json({ error: "No se pudieron recuperar los tickets." });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
