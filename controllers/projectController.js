import projectModel from '../models/projectModel.js';
import taskModel from '../models/taskModel.js';
import accountModel from '../models/accountModel.js';
import teamModel from '../models/teamModel.js';

export const registerProject = async (req, res) => {
  try {
    const {
      projectCategory,
      projectClientId,
      projectName,
      startDate,
      dueDate,
      projectNote,
      projectType,
      rate,
      amount,
      budget,
      whoCanEdit,
      whoCanEditId,
    } = req.body;

    let project;

    if (whoCanEdit === 'Specific') {
      project = new projectModel({
        projectCreatorId: req.accountInfo.id,
        projectCategory,
        projectName,
        projectClientId,
        startDate,
        dueDate,
        projectNote,
        projectType,
        rate,
        amount,
        budget,
        whoCanEdit,
        whoCanEditId,
      });
    } else {
      project = new projectModel({
        projectCreatorId: req.accountInfo.id,
        projectCategory,
        projectName,
        projectClientId,
        startDate,
        dueDate,
        projectNote,
        projectType,
        rate,
        amount,
        budget,
        whoCanEdit,
      });
    }

    if (!projectCategory) {
      return res.status(400).json({
        projectCategory: { msg: 'Please select the project category' },
      });
    }

    if (!whoCanEdit) {
      return res.status(400).json({
        whoCanEdit: { msg: 'Please select who can manage the project' },
      });
    }

    const chkProjName = await projectModel.findOne({ projectName });

    if (chkProjName) {
      return res
        .status(400)
        .json({ projectName: { msg: 'Project name already exists' } });
    }

    await project.save();

    res.status(200).json({
      _id: project._id,
      projectName: projectName,
      msg: 'Your project has been successfully created.',
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

export const getProjectList = async (req, res) => {
  try {
    // await projectModel
    //   .find({})
    //   .populate('projectClientId')
    //   .then((result) => res.send(result));
    await projectModel
      .aggregate([
        {
          $lookup: {
            from: 'accountmodels',
            localField: 'projectCreatorId',
            foreignField: '_id',
            as: 'creator',
          },
        },
        {
          $lookup: {
            from: 'clientmodels',
            localField: 'projectClientId',
            foreignField: '_id',
            as: 'client',
          },
        },
      ])
      .then((result) => res.send(result));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    var returnReference;

    const project = await projectModel
      .findById(req.params.id)
      .populate('projectClientId')
      .populate('projectCreatorId');

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProjectTaskListById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const projectTaskList = await taskModel
      .find({
        projectId: { $in: [projectId] },
      })
      .populate('invitedPeopleId');

    res.status(200).json(projectTaskList);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProjectById = async (req, res) => {
  try {
    const {
      projectCategory,
      projectName,
      projectClientId,
      startDate,
      dueDate,
      projectNote,
      projectType,
      rate,
      amount,
      budget,
      whoCanEdit,
      whoCanEditId,
    } = req.body;

    const prevProjName = projectName;

    const updatedBy = await accountModel.findById(req.accountInfo._id);

    const chkProjName = await projectModel.findOne({ projectName });

    if (prevProjName !== projectName) {
      if (chkProjName) {
        console.log('Project name already exists');
      }
    }

    const project = await projectModel.findById(req.params.id);
    if (project) {
      project.projectCategory = projectCategory || project.projectCategory;
      project.projectClientId =
        projectClientId._id || projectClientId.projectClientId;
      project.projectName = projectName || project.projectName;
      project.startDate = startDate || project.startDate;
      project.dueDate = dueDate || project.dueDate;
      project.projectNote = projectNote || project.projectNote;
      project.projectType = projectType || project.projectType;
      project.rate = rate || project.rate;
      project.amount = amount || project.amount;
      project.budget = budget || project.budget;
      project.whoCanEdit = whoCanEdit || project.whoCanEdit;
      project.whoCanEditId = whoCanEditId || project.whoCanEditId;
      project.lastUpdate.date = new Date() || project.lastUpdate;
      project.lastUpdate.account = `${updatedBy.firstName} ${updatedBy.lastName}`;
      project.lastOpened = new Date() || project.lastOpened.date;
    }

    const updatedProjInfo = await project.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      _id: project._id,
      projectName: projectName,
      msg: 'Your project has been successfully updated.',
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProjectById = async (req, res) => {
  try {
    const account = await accountModel.findById(req.accountInfo._id);
    const project = await projectModel.findById(req.params.id);
    const chkTaskId = JSON.stringify(project?.projectCreatorId);

    console.log(project);

    if (project) {
      if (JSON.stringify(account._id) === chkTaskId || account.isAdmin) {
        await project.deleteOne();
        res.status(200).json({
          _id: project._id,
          projectName: project.projectName,
          msg: 'Your project has been successfully deleted.',
        });
      } else {
        res.status(400).json({
          msg: `You don't have permission to delete this project.`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
