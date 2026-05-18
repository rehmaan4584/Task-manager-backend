import { Worker } from "bullmq";
import { redisConnectionOptions } from "../config/bullmqRedis.js";
import Task from "../models/tasks.js";
import connectDB from "../config/db.js";
import IORedis from "ioredis";

await connectDB(); 

const REMINDER_CHANNEL = "reminder:events";
const pubConnection = new IORedis(redisConnectionOptions);

const reminderWorker = new Worker("reminder-queue", async (job) => {
    console.log(`[ReminderWorker] started jobId=${job.id}`);
    console.log(
  "JOB FIRED AT:",
  new Date().toISOString()
);
    try {
        const { taskId} = job.data;
        console.log(`[ReminderWorker] loading task taskId=${taskId}`);
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        // Worker runs in a separate process, so we can't access the in-memory Socket.IO server.
        // Publish via Redis; the main server will forward it to the Socket.IO user room.
        const message = task?.taskName
          ? `Reminder: ${task.taskName}`
          : "Reminder for task";

        await pubConnection.publish(
          REMINDER_CHANNEL,
          JSON.stringify({
            userId: task.userId?.toString?.() ?? String(task.userId),
            message,
            taskId: task._id?.toString?.() ?? String(task._id),
          }),
        );
        console.log(
          `[ReminderWorker] published reminder channel=${REMINDER_CHANNEL} jobId=${job.id} userId=${task.userId?.toString?.() ?? String(task.userId)}`
        );
    } catch (error) {
        console.error(`[ReminderWorker] job failed jobId=${job.id} error=${error?.message}`);
        throw error;
    }

}, {
    connection: redisConnectionOptions,
});

reminderWorker.on("completed", (job) => {
    console.log(`✅ Job completed: ${job.id}`);
});

reminderWorker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job.id}`, err);
});

export default reminderWorker;