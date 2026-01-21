import prisma from "../db";
import { redis } from "../cache";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const TODOS_CACHE_KEY = "todos:all";
const TODOS_TTL = 60; // seconds

export async function findAllTodos(): Promise<{
  source: string;
  data: any;
}> {
  // 1. cek cache
  const cached = await redis.get(TODOS_CACHE_KEY);
  if (cached) {
    return {
      source: "cached",
      data: JSON.parse(cached),
    };
  }

  // 2. query database
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 3. simpan ke cache
  await redis.set(TODOS_CACHE_KEY, JSON.stringify(todos), "EX", TODOS_TTL);
  return {
    source: "database",
    data: todos,
  };
}

export async function createTodo(title: string): Promise<Todo> {
  return prisma.todo.create({
    data: {
      title,
    },
  });
}

export async function updateTodoCompleted(
  id: number,
  completed: boolean,
): Promise<Todo | null> {
  return prisma.todo
    .update({
      where: { id },
      data: { completed },
    })
    .catch(() => null);
}

export async function deleteTodoById(id: number): Promise<void> {
  await prisma.todo.delete({
    where: { id },
  });
}
