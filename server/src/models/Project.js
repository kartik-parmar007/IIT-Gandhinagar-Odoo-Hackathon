import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    projectManager: {
      type: String,
      default: "",
    },
    deadline: {
      type: String,
      default: "",
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
    image: {
      type: String,
      default: null,
    },
    assigneeImage: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    taskCount: {
      type: Number,
      default: 0,
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

export default mongoose.model("Project", projectSchema);

