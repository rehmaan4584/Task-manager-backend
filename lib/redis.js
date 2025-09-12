import dotenv from "dotenv"
dotenv.config({ path: "./.env" });

import { createClient } from "redis";

// console.log("REDIS_URL:", process.env.REDIS_URL); 
const client = createClient({
    
  url: process.env.REDIS_URL
});

client.on("error", (err) => console.error("Redis client error", err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log("Connected to redis");
  }
}

export { client, connectRedis };
