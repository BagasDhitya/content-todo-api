import cron from "node-cron";
import { findAllTodos, createTodo } from "../services/todo.service";

export function getTodosCron() {
  cron.schedule("* * * * *", async () => {
    console.log(`[${new Date().toISOString()}] Cron GET todos running ...`);
    try {
      const result = await findAllTodos();
      console.log(`[${new Date().toISOString()}] todos fetched 
      from ${result.source}.Count: ${result.data.length}`);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error fetching todos : `,
        error,
      );
    }
  });
}

export function scheduleTodoPost(userDate: Date, title: string) {
  const minute = userDate.getMinutes();
  const hour = userDate.getHours();
  const day = userDate.getDate();
  const month = userDate.getMonth() + 1;

  const cronExpression = `${minute} ${hour} ${day} ${month} *`;
  console.log(`[${new Date().toISOString()}] Scheduling todo : ${title} 
    at ${userDate.toISOString()} (cron: ${cronExpression})`);

  cron.schedule(cronExpression, async () => {
    console.log(`[${new Date().toISOString()}] Cron POST todo running ...`);
    try {
      const todo = await createTodo(title);
      console.log(`[${new Date().toISOString()}] Todo created: ${todo}`);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error creating todo : `,
        error,
      );
    }
  });
}
