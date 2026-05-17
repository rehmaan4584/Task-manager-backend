import IORedis from "ioredis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
const envPath = path.resolve(__dirname, "..", envFile);

dotenv.config({ path: envPath });

const baseOptions = {
  maxRetriesPerRequest: null,
};

const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, baseOptions)
  : new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      ...baseOptions,
    });

connection.on("connect", () => {
    console.log("IORedis connected successfully");
});

connection.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export default connection;