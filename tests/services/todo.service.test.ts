import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import prisma from "../../src/db";
import { redis } from "../../src/cache";
import {
  findAllTodos,
  createTodo,
  updateTodoCompleted,
  deleteTodoById,
} from "../../src/services/todo.service";

// buat mock prisma & redis
jest.mock("../../src/db", () => ({
  __esModule: true,
  default: mockDeep(),
}));

jest.mock("../../src/cache", () => ({
  __esModule: true,
  redis: mockDeep(),
}));

let prismaMock: DeepMockProxy<typeof prisma>;
let redisMock: DeepMockProxy<typeof redis>;

beforeEach(() => {
  prismaMock = prisma as unknown as DeepMockProxy<typeof prisma>;
  redisMock = redis as unknown as DeepMockProxy<typeof redis>;
  jest.clearAllMocks();
});

describe("Todo Service", () => {
  describe("findAllTodos", () => {
    it("should return todos from cache if exists", async () => {
      const cachedData = [
        {
          id: 1,
          title: "Test",
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];

      redisMock.get.mockResolvedValue(JSON.stringify(cachedData));
      const result = await findAllTodos();

      expect(result.source).toBe("cached");
      expect(result.data).toEqual(cachedData);
      expect(prismaMock.todo.findMany).not.toHaveBeenCalled();
    });
  });

  it("should return todos from database and cache them if cache is empty", async () => {
    redisMock.get.mockResolvedValue(null);
    const dbData = [
      {
        id: 1,
        title: "DB Todo",
        completed: false,
        createdAt: new Date(),
      },
    ];

    prismaMock.todo.findMany.mockResolvedValue(dbData);
    const result = await findAllTodos();

    expect(result.source).toBe("database");
    expect(result.data).toEqual(dbData);
    expect(redisMock.set).toHaveBeenCalledWith(
      "todos:all",
      JSON.stringify(dbData),
      "EX",
      60,
    );
  });
});

describe("createTodo", () => {
  it("should create a todo and return it", async () => {
    const newTodo = {
      id: 1,
      title: "New todo",
      completed: false,
      createdAt: new Date(),
    };

    prismaMock.todo.create.mockResolvedValue(newTodo);

    const result = await createTodo("New todo");
    expect(result).toEqual(newTodo);
    expect(prismaMock.todo.create).toHaveBeenCalledWith({
      data: {
        title: "New todo",
      },
    });
  });
});
