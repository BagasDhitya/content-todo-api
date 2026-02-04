import request from "supertest";
import express from "express";
import todoRouter from "../../src/routes/todo.route";
import * as todoService from "../../src/services/todo.service";
import { AppError } from "../../src/utils/AppError";

const app = express();
app.use(express.json());
app.use("/todos", todoRouter);

// mock service supaya controller bisa jalan tanpa DB
jest.mock("../../src/services/todo.service");

describe("Todo Controller", () => {
  (it("GET /todos return todos"),
    async () => {
      (todoService.findAllTodos as jest.Mock).mockResolvedValue({
        source: "database",
        data: [
          {
            id: 1,
            title: "Test",
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const res = await request(app).get("/todos");
      expect(res.status).toBe(200);
      expect(res.body.source).toBe("database");
      expect(res.body.data.length).toBe(1);
    });

  it("POST /todos returns 400 if title missing", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.status).toBe(400);
  });
});
