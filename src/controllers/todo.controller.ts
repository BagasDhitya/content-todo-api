import { Request, Response } from "express";
import {
  findAllTodos,
  createTodo as createTodoService,
  updateTodoCompleted,
  deleteTodoById,
} from "../services/todo.service";
import { AppError } from "../utils/AppError";
import { deleteTodoQueue } from "../helpers/todoQueue";
import { sanitizeBoolean, sanitizeId, sanitizeText } from "../helpers/sanitize";

export async function getTodos(req: Request, res: Response) {
  const todos = await findAllTodos();
  res.json(todos);
}

export async function createTodo(req: Request, res: Response) {
  let { title } = req.body;

  if (!title) {
    throw new AppError("Title is required", 400);
  }

  // sanitize req.body {title}
  title = sanitizeText(title);

  if (title.length === 0) {
    throw new AppError("Title cannot be empty", 400);
  }

  const todo = await createTodoService(title);
  res.status(201).json(todo);
}

export async function updateTodo(req: Request, res: Response) {
  // sanitize req.params dan req.body sebelum update
  const id = sanitizeId(req.params.id);
  const completed = sanitizeBoolean(req.body.completed);

  const todo = await updateTodoCompleted(Number(id), completed);

  if (!todo) {
    throw new AppError("Todo not found", 404);
  }

  res.json(todo);
}

export async function deleteTodo(req: Request, res: Response) {
  const { id } = req.params;

  // masukkan job ke queue, bukan langsung delete
  const deleted = await deleteTodoQueue.add(Number(id), {
    attempts: 3, // retry 3x kalau gagal
    backoff: 5000, // jeda 5 detik sebelum retry
  });

  if (!deleted) {
    throw new AppError("Todo not found", 404);
  }

  res.status(204).send();
}
