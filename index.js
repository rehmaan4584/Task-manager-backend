import dotenv from "dotenv"
dotenv.config({ path: "./.env" });

import express from "express"
import userRoutes from "./routes/userRoute.js"
import authRoutes from "./routes/authRoute.js"
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./lib/redis.js";


const app = express();
app.use(express.json());

await connectDB();
await connectRedis();


const PORT = process.env.PORT;

app.use('/api/auth',authRoutes);
app.use('/api',userRoutes);
app.use('/api/task',taskRoutes);


app.listen(PORT,()=>{
    console.log(`app is listening on ${PORT}`);
})