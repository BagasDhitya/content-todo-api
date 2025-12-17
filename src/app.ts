import express from "express";
import todoRoutes from "./routes/todo.route.ts";

const app = express();

app.use(express.json());
app.use("/todos", todoRoutes);

export default app;
