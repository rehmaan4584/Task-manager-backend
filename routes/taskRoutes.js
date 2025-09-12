import express from "express";
import taskController from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/create',authMiddleware,taskController.createTask);


export default router;