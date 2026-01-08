import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller";

const router = Router();
const { verifyToken } = AuthMiddleware();

// GUEST & VIP boleh GET
router.get("/", verifyToken, requireRole(["GUEST", "VIP"]), getTodos);

// HANYA VIP
router.post("/", verifyToken, requireRole(["VIP"]), createTodo);

router.put("/:id", verifyToken, requireRole(["VIP"]), updateTodo);

router.delete("/:id", verifyToken, requireRole(["VIP"]), deleteTodo);

export default router;
