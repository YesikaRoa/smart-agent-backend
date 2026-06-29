import cors from "cors";
import "dotenv/config";
import express from "express";
import chatRoutes from "./routes/chat.routes";
import ticketRoutes from "./routes/ticket.routes";

export const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://smart-agentt.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/tickets", ticketRoutes);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

export default app;

