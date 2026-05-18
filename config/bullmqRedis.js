import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

const envPath = path.resolve(__dirname, "..", envFile);

dotenv.config({ path: envPath });

export const redisConnectionOptions = process.env.REDIS_URL
  ? {
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null,
    }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      maxRetriesPerRequest: null,
    };