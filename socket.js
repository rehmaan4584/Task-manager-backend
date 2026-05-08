import { Server } from "socket.io";
import IORedis from "ioredis";

let io;
let subscriber;
let subscribed = false;

const REMINDER_CHANNEL = "reminder:events";

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
    subscriber = new IORedis({
      host: "localhost",
      port: 6379,
      maxRetriesPerRequest: null,
    });

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