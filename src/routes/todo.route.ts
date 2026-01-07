import { Router } from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();
const { verifyToken } = AuthMiddleware();

router.get("/", verifyToken, getTodos);
router.post("/", verifyToken, createTodo);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;
