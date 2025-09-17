import mongoose, { Schema } from "mongoose";
const { ObjectId } = Schema.Types;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: ObjectId,
      ref: "User",
      //   required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
