import type { Request, Response } from "express";
import { n8nService } from "../services/n8n.service";

export const chatController = {
  async handleChat(req: Request, res: Response) {
    const { mensaje } = req.body;

    if (!mensaje || typeof mensaje !== "string") {
      return res.status(400).json({ error: "El campo 'mensaje' es obligatorio." });
    }

    try {
      const result = await n8nService.sendMessage(mensaje);
      return res.status(result.status).json(result.data);
    } catch (error) {
      const err = error as Error & { statusCode?: number };
      const status = err.statusCode ?? 500;
      return res.status(status).json({ error: err.message || "Error interno del servidor." });
    }
  },
};
