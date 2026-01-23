import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.route";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { getTodosCron, scheduleTodoPost } from "./helpers/todoCron";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

getTodosCron()

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
