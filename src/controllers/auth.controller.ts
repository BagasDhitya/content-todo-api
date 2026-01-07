import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { loginWithGoogle } from "../services/auth.service";

/**
 * Register controller
 */
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(email, password);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
}

/**
 * Login controller
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const { token } = await loginUser(email, password);

    res.json({
      message: "Login success",
      token,
    });
  } catch (error) {
    res.status(401).json({
      message: (error as Error).message,
    });
  }
}

export async function googleLogin(req: Request, res: Response) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "idToken is required",
      });
    }

    const { token } = await loginWithGoogle(idToken);

    res.json({
      message: "Login with Google success",
      token,
    });
  } catch (error) {
    res.status(401).json({
      message: (error as Error).message,
    });
  }
}
