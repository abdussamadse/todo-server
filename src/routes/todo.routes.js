import express from "express";
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
} from "../controllers/todo.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all routes below
// router.use(protect);

// CRUD routes for Todos
router.post("/", createTodo); // Create a new todo
router.get("/", getTodos); // Get all todos for user
router.delete("/", deleteAllTodos); // Delete all todos for user
router.get("/:id", getTodoById); // Get single todo by ID
router.put("/:id", updateTodo); // Update todo by ID
router.delete("/:id", deleteTodo); // Delete todo by ID

export default router;
