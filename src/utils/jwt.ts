import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
