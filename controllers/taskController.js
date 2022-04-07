import fs from 'fs';
import taskModel from '../models/taskModel.js';
import projectModel from '../models/projectModel.js';
import accountModel from '../models/accountModel.js';

export const registerTask = async (req, res) => {
  try {
    const {
      projectId,
      taskName,
      taskNote,
      taskReporterId,
      taskAssigneeId,
      startDate,
      dueDate,
      taskType,
      attachments,
      priority,
      invitedPeopleId,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({
        projectId: { msg: `Please select project for this task` },
      });
    }

    const chkTaskName = await taskModel.findOne({ taskName });

    if (chkTaskName) {
      return res.status(400).json({
        taskName: { msg: `Task is already exists` },
      });
    }

    if (!taskName) {
      return res.status(400).json({
        taskName: { msg: `Task is already exists` },
      });
    }

    if (!taskReporterId) {
      return res.status(400).json({
        taskReporterId: { msg: `Please who is the reporter for this task` },
      });
    }

    if (!taskAssigneeId) {
      return res.status(400).json({
        taskAssigneeId: { msg: `Please select the assignee for this task` },
      });
    }

    if (!taskType) {
      return res.status(400).json({
        taskType: { msg: `Please select the type for this task` },
      });
    }

    const taskCreator = await accountModel.findById(req.accountInfo.id);
    const project = await projectModel.findById(projectId);

    let task;

    if (attachments.fileThumbnail) {
      task = new taskModel({
        projectId: project,
        taskCreatorId: taskCreator._id,
        taskName,
        taskNote,
        startDate,
        dueDate,
        taskType,
        taskAssigneeId: taskAssigneeId,
        taskReporterId: taskReporterId,
        priority,
        attachments,
        invitedPeopleId,
      });
    } else {
      task = new taskModel({
        projectId: project,
        taskCreatorId: taskCreator._id,
        taskName,
        taskNote,
        startDate,
        dueDate,
        taskType,
        taskAssigneeId: taskAssigneeId,
        taskReporterId: taskReporterId,
        priority,
        invitedPeopleId,
      });
    }

    await task.save();

    res.status(200).json({
      _id: task._id,
      taskName: taskName,
      msg: 'Your task has been successfully created.',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).json({ msg: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskModel
      .findById(req.params.id)
      .populate('taskCreatorId')
      .populate('projectId')
      .populate('invitedPeopleId');
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getTaskByName = async (req, res) => {
  try {
    const taskName = req.params.taskLink;
    const task = await taskModel
      .find({ taskName })
      .populate('taskCreatorId')
      .populate('projectId')
      .populate('invitedPeopleId');

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const updateTaskById = async (req, res) => {
  try {
    const {
      _id,
      projectId,
      taskName,
      dueDate,
      taskReporterId,
      taskAssigneeId,
      priority,
      taskType,
      invitedPeopleId,
      attachments,
    } = req.body.taskInfo;

    const prevTaskName = taskName;

    const updatedBy = await accountModel.findById(req.accountInfo._id);

    const chkTaskName = await taskModel.findOne({ taskName });

    if (prevTaskName !== taskName) {
      if (chkTaskName) {
        res.status(400).json({
          taskName: { msg: `Task is already exists` },
        });
      }
    }

    const task = await taskModel.findById(req.params.id);
    if (task) {
      task.projectId = projectId || task.projectId;
      task.taskName = taskName || task.taskName;
      task.taskNote = req.body.updatedDescription.taskNote || task.taskNote;
      task.dueDate = dueDate || task.dueDate;
      task.taskReporterId = taskReporterId || task.taskReporterId;
      task.taskAssigneeId = taskAssigneeId || task.taskAssigneeId;
      task.priority = priority || task.task.priority;
      task.invitedPeopleId = invitedPeopleId || task.invitedPeopleId;
      task.taskType = taskType || task.taskType;
      task.invitedPeopleId = invitedPeopleId || task.invitedPeopleId;
      task.lastUpdate.date = new Date() || task.lastUpdate;
      task.lastUpdate.account = `${updatedBy.firstName} ${updatedBy.lastName}`;
    }

    if (task.attachments.length !== attachments.length) {
      for (var i = 0; i < req.body.attachments.length; i++) {
        await taskModel.updateOne(
          { _id: req.params.id },
          {
            $push: {
              attachments: {
                name: req.body.attachments[i].name,
                fileThumbnail: req.body.attachments[i].fileThumbnail,
                size: req.body.attachments[i].size,
                uploadDate: req.body.attachments[i].uploadDate,
              },
            },
          },
          { returnOriginal: false }
        );
      }
    }
    await task.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      _id: task._id,
      taskName: taskName,
      msg: 'Your task has been modified.',
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTaskById = async (req, res) => {
  try {
    const account = await accountModel.findById(req.accountInfo._id);
    const task = await taskModel.findById(req.params.id);
    const chkTaskId = JSON.stringify(task?.taskCreatorId);

    if (task) {
      if (JSON.stringify(account._id) === chkTaskId || account.isAdmin) {
        await task.deleteOne();
        res.status(200).json({
          _id: task._id,
          projectName: task.projectName,
          msg: 'Your task has been successfully deleted.',
        });
      } else {
        res.status(400).json({
          msg: `You don't have permission to delete this task.`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const updateTaskStatusById = async (req, res) => {
  try {
    const taskStatus = await taskModel.findById(req.params.id);
    if (taskStatus) {
      taskStatus.taskStatus = req.body.status || taskStatus.taskStatus;
    }

    const updatedTaskStatus = await taskStatus.save({
      validateBeforeSave: false,
    });

    res.status(200).json(updatedTaskStatus);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getTaskList = async (req, res) => {
  try {
    await taskModel
      .find({})
      .populate('taskCreatorId')
      .populate('projectId')
      .populate('invitedPeopleId')
      .then((result) => res.send(result));
    // await taskModel
    //   .aggregate([
    //     {
    //       $lookup: {
    //         from: 'accountmodels',
    //         localField: 'taskCreatorId',
    //         foreignField: '_id',
    //         as: 'creator',
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: 'projectmodels',
    //         localField: 'projectId',
    //         foreignField: '_id',
    //         as: 'project',
    //       },
    //     },
    //   ])
    //   .then((result) => res.send(result));
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const uploadTaskAttachments = async (req, res) => {
  try {
    const reqFiles = [];

    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push({
        fileThumbnail: `${process.env.SERVER_DOMAIN}/${req.files[
          i
        ].path.replace(/\\/g, '/')}`,
        name: req.files[i].filename,
        size: req.files[i].size,
        uploadDate: new Date(),
        status: true,
      });
    }
    res.status(200).json(reqFiles);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTaskAttachment = async (req, res) => {
  try {
    fs.unlinkSync(`../public/uploads/${req.params.path}/${req.params.name}`);
    res.status(200).json({ msg: `Image Deleted` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTaskFileAttachmentFile = async (req, res) => {
  try {
    const chkTask = await taskModel.findById(req.params.id);
    if (chkTask) {
      chkTask.attachments = chkTask.attachments.filter(
        (data) => data.name !== req.params.name
      );

      await chkTask.save({
        validateBeforeSave: false,
      });

      res.status(200).json(chkTask.attachments);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
