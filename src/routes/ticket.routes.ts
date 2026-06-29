import { Router } from "express";
import { ticketController } from "../controllers/ticket.controller";

const router = Router();

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getTickets);

export default router;
