import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null
  });

connection.on("connect", () => {
    console.log("IORedis connected successfully");
});

connection.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export default connection;