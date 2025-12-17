import { Request, Response } from "express";
import pool from "../db.ts";

export async function getTodos(req: Request, res: Response) {
  const result = await pool.query(
    "SELECT * FROM todos ORDER BY created_at DESC"
  );
  res.json(result.rows);
}

export async function createTodo(req: Request, res: Response) {
  const { title } = req.body;

  const result = await pool.query(
    "INSERT INTO todos (title) VALUES ($1) RETURNING *",
    [title]
  );

  res.status(201).json(result.rows[0]);
}

export async function updateTodo(req: Request, res: Response) {
  const { id } = req.params;
  const { completed } = req.body;

  const result = await pool.query(
    "UPDATE todos SET completed=$1 WHERE id=$2 RETURNING *",
    [completed, id]
  );

  res.json(result.rows[0]);
}

export async function deleteTodo(req: Request, res: Response) {
  const { id } = req.params;

  await pool.query("DELETE FROM todos WHERE id=$1", [id]);
  res.status(204).send();
}
