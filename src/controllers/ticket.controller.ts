import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const ticketController = {
  async createTicket(req: Request, res: Response) {
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
      console.error("No se pudo guardar el ticket:", error);
      return res.status(500).json({ error: "No se pudo guardar el ticket." });
    }
  },

  async getTickets(req: Request, res: Response) {
    try {
      const tickets = await prisma.ticket.findMany({
        take: 20,
        orderBy: {
          fechaCreacion: "desc",
        },
      });

      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error al obtener tickets:", error);
      return res.status(500).json({ error: "No se pudieron recuperar los tickets." });
    }
  },
};
