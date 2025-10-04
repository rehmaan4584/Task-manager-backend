import express from "express";
import taskController from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/create',authMiddleware,taskController.createTask);
router.get('/all',authMiddleware,taskController.getAllTasks);
router.put('/edit',authMiddleware,taskController.editTask);
router.delete('/:id',authMiddleware,taskController.deleteTask);
router.patch('/:id/toggle',authMiddleware,taskController.toggleComplete);




export default router;