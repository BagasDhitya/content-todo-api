import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  refresh,
  logout,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
