import { AppError } from "../utils/AppError";

export function sanitizeText(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function sanitizeId(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError("Invalid ID", 400);
  }

  return parsed;
}

export function sanitizeBoolean(input: unknown) {
  if (typeof input === "boolean") return input;
  throw new AppError("Completed must be boolean", 400);
}
