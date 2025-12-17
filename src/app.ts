import express from "express";
import todoRoutes from "./routes/todo.route.js";

const app = express();

app.use(express.json());
app.use("/todos", todoRoutes);

export default app;
