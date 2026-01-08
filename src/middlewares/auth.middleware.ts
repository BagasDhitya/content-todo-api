import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

interface JwtPayload {
  userId: number;
  email: string;
  role: "GUEST" | "VIP";
}

export default function AuthMiddleware() {
  function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.log("JWT ERROR:", error);
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  }

  return { verifyToken };
}
