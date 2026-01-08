import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface AuthToken {
  token: string;
}

/**
 * Generate JWT token
 */
function generateToken(
  userId: number,
  email: string,
  role: "GUEST" | "VIP"
): AuthToken {
  const token = jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token };
}

/**
 * Register user
 */
export async function registerUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}

/**
 * Login with email & password
 */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { token: refreshToken, tokenHash } = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(idToken: string): Promise<AuthToken> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  // 🔹 Auto register if not exists
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        password: "", // OAuth user
      },
    });
  }

  return generateToken(user.id, user.email, user.role);
}
