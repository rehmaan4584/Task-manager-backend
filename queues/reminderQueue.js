import { Queue } from "bullmq";
import { redisConnectionOptions } from "../config/bullmqRedis.js";

const reminderQueue = new Queue("reminder-queue", {
    connection: redisConnectionOptions,
});

export default reminderQueue;