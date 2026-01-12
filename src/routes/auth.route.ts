import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  refresh,
  logout,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleLoginSchema), googleLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
