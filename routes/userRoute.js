import express from "express"
import user from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/user',authMiddleware,user.getAllUsers);


export default router;