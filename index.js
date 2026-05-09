import dotenv from "dotenv"
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });
import cors from "cors";
import express from "express";
import userRoutes from "./routes/userRoute.js"
import authRoutes from "./routes/authRoute.js"
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/db.js";
import { client, connectRedis } from "./lib/redis.js";
import { initSocket } from "./socket.js";
import http from "http";
import mongoose from "mongoose";


const app = express();
app.use(cors());
app.use(express.json());

await connectDB();
await connectRedis();

const PORT = process.env.PORT;
const server = http.createServer(app);
initSocket(server);
app.get("/api/health", (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const mongoConnected = mongoState === 1;
  const redisConnected = client?.isOpen === true;
  const status = mongoConnected && redisConnected ? "ok" : "degraded";

  return res.status(status === "ok" ? 200 : 503).json({
    success: status === "ok",
    status,
    service: "task-manager-backend",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    checks: {
      mongodb: mongoConnected ? "up" : "down",
      redis: redisConnected ? "up" : "down",
    },
  });
});
app.use('/api/auth',authRoutes);
app.use('/api',userRoutes);
app.use('/api/task',taskRoutes);


server.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server is listening on ${PORT}`);
})