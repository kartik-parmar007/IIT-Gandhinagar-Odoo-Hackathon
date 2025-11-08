import Task from "../models/Task.js";

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res) => {
  try {
    const {
      name,
      project,
      status,
      priority,
      rating,
      assignees,
      deadline,
      tags,
      image,
      description,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Task name is required",
      });
    }

    const task = await Task.create({
      name,
      project: project || "",
      status: status || "New",
      priority: priority || "Medium",
      rating: rating !== undefined ? rating : 0,
      assignees: assignees || [],
      deadline: deadline ? String(deadline) : "",
      tags: tags || [],
      image: image || null,
      description: description || "",
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res) => {
  try {
    const {
      name,
      project,
      status,
      priority,
      rating,
      assignees,
      deadline,
      tags,
      image,
      description,
    } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.name = name || task.name;
    task.project = project !== undefined ? project : task.project;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.rating = rating !== undefined ? rating : task.rating;
    task.assignees = assignees !== undefined ? assignees : task.assignees;
    task.deadline = deadline !== undefined ? String(deadline) : task.deadline;
    task.tags = tags !== undefined ? tags : task.tags;
    task.image = image !== undefined ? image : task.image;
    task.description =
      description !== undefined ? description : task.description;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

