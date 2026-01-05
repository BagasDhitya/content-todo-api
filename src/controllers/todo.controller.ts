import { Request, Response } from "express";
import {
  findAllTodos,
  createTodo as createTodoService,
  updateTodoCompleted,
  deleteTodoById,
} from "../services/todo.service";

export async function getTodos(req: Request, res: Response) {
  const todos = await findAllTodos();
  res.json(todos);
}

export async function createTodo(req: Request, res: Response) {
  const { title } = req.body;

  const todo = await createTodoService(title);
  res.status(201).json(todo);
}

export async function updateTodo(req: Request, res: Response) {
  const { id } = req.params;
  const { completed } = req.body;

  const todo = await updateTodoCompleted(id, completed);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json(todo);
}

export async function deleteTodo(req: Request, res: Response) {
  const { id } = req.params;

  await deleteTodoById(id);
  res.status(204).send();
}
