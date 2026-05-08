import { Queue } from "bullmq";
import connection from "../config/bullmqRedis.js";

const reminderQueue = new Queue("reminder-queue", {
    connection,
});

export default reminderQueue;