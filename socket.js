import { Server } from "socket.io";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.development",
});

let io;
let subscriber;
let subscribed = false;

const REMINDER_CHANNEL = "reminder:events";
const redisSubscriberOptions = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      maxRetriesPerRequest: null,
    };

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    });
  });

  // Bridge reminders from BullMQ worker (separate process) to Socket.IO.
  // The worker publishes to Redis; this server subscribes and forwards to the user room.
  if (!subscriber) {
    subscriber = new IORedis(redisSubscriberOptions);

    subscriber.on("connect", () => {
      console.log("IORedis subscriber connected");
    });
    subscriber.on("error", (err) => {
      console.error("IORedis subscriber error:", err);
    });
  }

  if (!subscribed) {
    subscriber.on("message", (channel, rawMessage) => {
      if (channel !== REMINDER_CHANNEL) return;

      try {
        const data = JSON.parse(rawMessage);
        const userId = data?.userId;
        if (!userId) return;

        io.to(userId.toString()).emit("reminder", {
          message: data?.message ?? "Reminder for task",
          taskId: data?.taskId,
        });
        console.log(
          `[SocketBridge] forwarded reminder channel=${channel} userId=${userId} taskId=${data?.taskId ?? "unknown"}`
        );
      } catch (e) {
        console.error("Invalid reminder payload:", e?.message);
      }
    });

    subscriber.subscribe(REMINDER_CHANNEL).then(() => {
      subscribed = true;
      console.log(`Subscribed to ${REMINDER_CHANNEL}`);
    });
  }
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};