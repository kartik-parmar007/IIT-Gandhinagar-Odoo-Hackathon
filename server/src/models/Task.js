import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Done"],
      default: "New",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    rating: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    assignees: {
      type: [String],
      default: [],
    },
    deadline: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);

