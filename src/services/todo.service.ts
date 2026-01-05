import pool from "../db";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
}

export async function findAllTodos(): Promise<Todo[]> {
  const result = await pool.query(
    "SELECT * FROM todos ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function createTodo(title: string): Promise<Todo> {
  const result = await pool.query(
    "INSERT INTO todos (title) VALUES ($1) RETURNING *",
    [title]
  );
  return result.rows[0];
}

export async function updateTodoCompleted(
  id: string,
  completed: boolean
): Promise<Todo | null> {
  const result = await pool.query(
    "UPDATE todos SET completed=$1 WHERE id=$2 RETURNING *",
    [completed, id]
  );

  return result.rows[0] ?? null;
}

export async function deleteTodoById(id: string): Promise<void> {
  await pool.query("DELETE FROM todos WHERE id=$1", [id]);
}