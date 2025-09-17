import Todo from "../models/todo.model.js";
import apiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";

// Create a new Todo
export const createTodo = catchAsync(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    throw new apiError("Title is required", 400);
  }

  const todo = await Todo.create({
    title,
    description,
    status,
    priority,
    dueDate,
    user: req.user?._id, // assuming user is set in auth middleware
  });

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

// Get all Todos (for logged-in user)
export const getTodos = catchAsync(async (req, res) => {
  //   const todos = await Todo.find({ user: req.user?._id }).sort({ createdAt: -1 });
  const todos = await Todo.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: todos.length,
    data: todos,
  });
});

// Get a single Todo by ID
export const getTodoById = catchAsync(async (req, res) => {
  const { id } = req.params;
  //   const todo = await Todo.findOne({ _id: id, user: req.user?._id });
  const todo = await Todo.findOne({ _id: id });

  if (!todo) {
    throw new apiError("Todo not found", 404);
  }

  res.status(200).json({
    success: true,
    data: todo,
  });
});

// Update a Todo
export const updateTodo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  //   const todo = await Todo.findOneAndUpdate(
  //     { _id: id, user: req.user?._id },
  //     updates,
  //     { new: true, runValidators: true }
  //   );

  const todo = await Todo.findOneAndUpdate({ _id: id }, updates, {
    new: true,
    runValidators: true,
  });

  if (!todo) {
    throw new apiError("Todo not found or not authorized", 404);
  }

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: todo,
  });
});

// Delete a Todo
export const deleteTodo = catchAsync(async (req, res) => {
  const { id } = req.params;
  //   const todo = await Todo.findOneAndDelete({ _id: id, user: req.user?._id });
  const todo = await Todo.findOneAndDelete({ _id: id });

  if (!todo) {
    throw new apiError("Todo not found or not authorized", 404);
  }

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
  });
});

// Delete all Todos for the logged-in user
export const deleteAllTodos = catchAsync(async (req, res) => {
  //   await Todo.deleteMany({ user: req.user?._id });
  await Todo.deleteMany();

  res.status(200).json({
    success: true,
    message: "All todos deleted successfully",
  });
});
