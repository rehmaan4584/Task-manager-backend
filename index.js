import dotenv from "dotenv"
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });
import cors from "cors";
import express from "express";
import userRoutes from "./routes/userRoute.js"
import authRoutes from "./routes/authRoute.js"
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./lib/redis.js";
import { initSocket } from "./socket.js";
import http from "http";


const app = express();
app.use(cors());
app.use(express.json());

await connectDB();
await connectRedis();

const PORT = process.env.PORT;
const server = http.createServer(app);
initSocket(server);
app.use('/api/auth',authRoutes);
app.use('/api',userRoutes);
app.use('/api/task',taskRoutes);


server.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server is listening on ${PORT}`);
})