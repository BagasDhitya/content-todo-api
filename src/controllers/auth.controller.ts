import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  loginWithGoogle,
} from "../services/auth.service";
import prisma from "../db";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

dotenv.config();

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
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/auth/refresh",
  });

  res.json({ accessToken });
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

export async function refresh(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
    userId: number;
  };

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      userId: payload.userId,
      expiresAt: { gt: new Date() },
    },
  });

  if (!storedToken) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  // 🔄 ROTATION
  await prisma.refreshToken.delete({
    where: { id: storedToken.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  const accessToken = generateAccessToken({
    userId: user!.id,
    email: user!.email,
    role: user!.role,
  });

  const { token: newRefresh, tokenHash: newHash } = generateRefreshToken(
    user!.id
  );

  await prisma.refreshToken.create({
    data: {
      tokenHash: newHash,
      userId: user!.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.cookie("refreshToken", newRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/auth/refresh",
  });

  res.json({ accessToken });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (token) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    await prisma.refreshToken.deleteMany({
      where: { tokenHash: hash },
    });
  }

  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  res.json({ message: "Logged out" });
}
