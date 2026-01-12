import { Request, Response } from "express";
import { updateProfilePicture, findUserById } from "../services/user.service";

export async function uploadProfilePictureController(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const userId = Number(req.params.userId);
    const updatedUser = await updateProfilePicture(userId, req.file.buffer);

    res.json({
      message: "Profile picture updated",
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getUserController(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
}
