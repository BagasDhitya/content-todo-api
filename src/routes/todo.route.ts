import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const { verifyToken } = AuthMiddleware();

// GUEST & VIP boleh GET
router.get(
  "/",
  verifyToken,
  requireRole(["GUEST", "VIP"]),
  asyncHandler(getTodos),
);

// HANYA VIP
router.post("/", verifyToken, requireRole(["VIP"]), asyncHandler(createTodo));

router.put("/:id", verifyToken, requireRole(["VIP"]), asyncHandler(updateTodo));

router.delete(
  "/:id",
  verifyToken,
  requireRole(["VIP"]),
  asyncHandler(deleteTodo),
);

export default router;
