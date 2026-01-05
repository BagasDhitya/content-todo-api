import prisma from "../db";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export async function findAllTodos(): Promise<Todo[]> {
  return prisma.todo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
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
  completed: boolean
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
