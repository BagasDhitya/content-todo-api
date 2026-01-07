import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface AuthToken {
  token: string;
}

/**
 * Generate JWT token
 */
function generateToken(userId: number, email: string): AuthToken {
  const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });

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
export async function loginUser(
  email: string,
  password: string
): Promise<AuthToken> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return generateToken(user.id, user.email);
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

  return generateToken(user.id, user.email);
}
