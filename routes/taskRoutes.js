import express from "express";
import taskController from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/create',authMiddleware,taskController.createTask);
router.get('/all',authMiddleware,taskController.getAllTasks);
router.put('/:id',authMiddleware,taskController.editTask);
router.delete('/:id',authMiddleware,taskController.deleteTask);



export default router;