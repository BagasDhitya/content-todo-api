import Queue from "bull";
import { deleteTodoById } from "../services/todo.service";

// 1. buat queue delete
export const deleteTodoQueue = new Queue<number>("delete-todo", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// 2. buat processor
deleteTodoQueue.process(async (job) => {
  const todoId = job.data;
  console.log(
    `${new Date().toISOString()} processing delete job for todo id = ${todoId}`,
  );
  try {
    await deleteTodoById(todoId);
    console.log(
      `${new Date().toISOString()} Todo id=${todoId} deleted successfully`,
    );
  } catch (error) {
    console.error(
      `${new Date().toISOString()} failed to delete todo id=${todoId}`,
      error,
    );
    throw error;
  }
});

// 3. optional : event listener
deleteTodoQueue.on("completed", (job) => {
  console.log("Job completed : ", job.id);
});

deleteTodoQueue.on("failed", (job, error) => {
  console.log(`Job failed : ${job.id}`, error);
});
