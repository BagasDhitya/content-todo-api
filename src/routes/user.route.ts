import { Router } from "express";
import {
  uploadProfilePictureController,
  getUserController,
} from "../controllers/user.controller";
import { upload } from "../helpers/uploadHelper";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();
const { verifyToken } = AuthMiddleware();

router.post(
  "/:userId/profile-picture",
  verifyToken,
  upload.single("profilePicture"),
  uploadProfilePictureController
);
router.get("/:userId", verifyToken, getUserController);

export default router;
