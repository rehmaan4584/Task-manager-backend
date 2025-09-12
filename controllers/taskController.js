import Task from "../models/tasks.js";

const createTask = async (req, res) => {
  try {
    const task = { ...req.body, userId: req.user.id };
    if (!task.userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }
    const createdTask = await Task.create(task);
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: createdTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error in creating task",
    });
  }
};

export default { createTask };
