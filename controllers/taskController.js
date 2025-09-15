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

const getAllTasks = async (req, res) => {
  try {
    const task = { userId: req.user.id };
    if (!task.userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }
    const allTasks = await Task.find();
    return res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: allTasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error in getting tasks",
    });
  }
};



const editTask = async (req, res) => {
  try {
    const task = { ...req.body, userId: req.user.id, taskId: req.params.id };
    if (!task.userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: task.taskId, userId: task.userId },
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error in creating task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = { userId: req.user.id, taskId: req.params.id };
    if (!task.userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }
    const deletedTask = await Task.findOneAndDelete(
      { _id: task.taskId, userId: task.userId },

    );
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error in deleting task",
    });
  }
};


export default { createTask, editTask ,getAllTasks, deleteTask };
