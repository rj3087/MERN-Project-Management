import accountModel from '../models/accountModel.js';
import departmentModel from '../models/departmentModel.js';
import clientModel from '../models/clientModel.js';
import teamModel from '../models/teamModel.js';

import { isEmailValid } from '../utils/validation.js';

export const registerDepartment = async (req, res) => {
  try {
    const { departmentName, departmentHeadId, departmentEmail } = req.body;

    const chkDeptName = await departmentModel.findOne({ departmentName });
    const chkDeptEmail = await departmentModel.findOne({ departmentEmail });

    if (chkDeptName) {
      return res.status(400).json({
        departmentName: { msg: `Name is already exists` },
      });
    }

    if (chkDeptEmail) {
      return res.status(400).json({
        departmentEmail: { msg: `Email is already exists` },
      });
    }

    const deptHeadId = await accountModel.findById(departmentHeadId);

    const department = new departmentModel({
      departmentHeadId: deptHeadId._id,
      departmentName,
      departmentEmail,
    });

    await department.save();

    res.status(200).json({
      _id: department._id,
      departmentName: departmentName,
      msg: `Your ${departmentName} has been successfully created.`,
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

export const getDepartmentById = async (req, res) => {
  try {
    const departmentById = await departmentModel.findById(
      req.params.departmentId
    );

    console.log(req.params.departmentId);
    res.status(200).json(departmentById);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDepartmentList = async (req, res) => {
  try {
    console.log(req.body);
    await departmentModel.find({}).then((result) => res.send(result));
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const registerClient = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientContact,
      clientLocation,
      accountProfileUploaded,
    } = req.body;

    const chkClientName = await clientModel.findOne({ clientName });
    const chkClientEmail = await clientModel.findOne({ clientEmail });
    const chkClientContact = await clientModel.findOne({ clientContact });

    if (chkClientName) {
      return res.status(400).json({
        clientName: { msg: `Name is already exists` },
      });
    }
    if (chkClientEmail) {
      return res.status(400).json({
        clientEmail: { msg: `Email is already exists` },
      });
    }

    if (chkClientContact) {
      return res.status(400).json({
        clientContact: { msg: `Contact is already exists` },
      });
    }

    const client = new clientModel({
      clientName,
      clientEmail,
      clientContact,
      clientLocation,
      accountProfileUploaded,
    });

    await client.save();

    res.status(200).json({
      _id: client._id,
      clientName: clientName,
      msg: `Your ${clientName} has been successfully created.`,
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

export const getClientList = async (req, res) => {
  try {
    await clientModel.find({}).then((result) => res.send(result));
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const registerTeam = async (req, res) => {
  try {
    const {
      teamName,
      teamEmail,
      teamDepartmentId,
      teamLeadId,
      teamDescription,
      invitedPeopleId,
    } = req.body;

    const chkTeamName = await teamModel.findOne({ teamName });

    if (chkTeamName) {
      return res.status(400).json({
        teamName: { msg: `Name is already exists` },
      });
    }

    const chkTeamEmail = await teamModel.findOne({ teamEmail });

    if (chkTeamEmail) {
      return res.status(400).json({
        teamEmail: { msg: `Email is already exists` },
      });
    }

    const chkDeptId = await departmentModel.findById(teamDepartmentId);
    const chkTeamLeadId = await accountModel.findById(teamLeadId);
    const team = new teamModel({
      teamName,
      teamEmail,
      teamDepartmentId: chkDeptId._idm,
      teamLeadId: chkTeamLeadId._id,
      teamDescription,
      invitedPeopleId,
    });

    await team.save();
    res.status(200).json({
      _id: team._id,
      teamName: teamName,
      msg: 'Your team has been successfully created.',
    });
  } catch (error) {
    console.log(error);
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

export const getTeamById = async (req, res) => {
  const teamById = await teamModel.findById(req.params.teamId);

  res.status(200).json(teamById);
};

export const getTeamsList = async (req, res) => {
  try {
    await teamModel.find({}).then((result) => res.send(result));
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
