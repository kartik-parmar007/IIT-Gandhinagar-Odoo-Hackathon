import Project from "../models/Project.js";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Public
export const createProject = async (req, res) => {
  try {
    const {
      name,
      tags,
      projectManager,
      deadline,
      priority,
      rating,
      image,
      assigneeImage,
      description,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      tags: tags || [],
      projectManager: projectManager || "",
      deadline: deadline ? String(deadline) : "",
      priority: priority || "Medium",
      rating: rating || 0,
      image: image || null,
      assigneeImage: assigneeImage || null,
      description: description || "",
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Public
export const updateProject = async (req, res) => {
  try {
    const {
      name,
      tags,
      projectManager,
      deadline,
      priority,
      rating,
      image,
      assigneeImage,
      description,
    } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.name = name || project.name;
    project.tags = tags !== undefined ? tags : project.tags;
    project.projectManager =
      projectManager !== undefined ? projectManager : project.projectManager;
    project.deadline = deadline !== undefined ? String(deadline) : project.deadline;
    project.priority = priority || project.priority;
    project.rating = rating !== undefined ? rating : project.rating;
    project.image = image !== undefined ? image : project.image;
    project.assigneeImage =
      assigneeImage !== undefined ? assigneeImage : project.assigneeImage;
    project.description =
      description !== undefined ? description : project.description;

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Public
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

