import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import accountModel from '../models/accountModel.js';
import teamModel from '../models/teamModel.js';

import {
  createActivationToken,
  createRefreshToken,
} from '../utils/createToken.js';
import {
  sendEmailConfirmation,
  sendEmailResetToken,
} from '../utils/sendEmail.js';
import { isEmailValid, isNameValid } from '../utils/validation.js';

export const registerAccount = async (req, res) => {
  const { isAdmin, email, firstName, lastName, password } = req.body;

  try {
    const chkEmail = await accountModel.findOne({ email });

    if (chkEmail) {
      return res
        .status(400)
        .json({ email: { msg: 'Email is already exists' } });
    }

    const account = new accountModel({
      isAdmin,
      email,
      firstName,
      lastName,
      password,
    });

    await account.save();

    const activationToken = createActivationToken({
      isAdmin,
      email,
      password,
      firstName,
      lastName,
    });

    sendEmailConfirmation({
      receiver: account,
      activationToken,
    });

    res.status(200).json({
      _id: account._id,
      email: account.email,
      password: account.password,
      firstName: account.firstName,
      lastName: account.lastName,
      msg: 'Your account has been successfully created.\r\nAn activation email was sent to your email.',
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

export const activateAccount = async (req, res) => {
  try {
    const accountInfo = jwt.verify(
      req.params.activationToken,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    const { email } = accountInfo;

    const chkEmail = await accountModel.findOne({ email });

    if (!chkEmail.isActive) {
      const isActive = true;

      await accountModel.findOneAndUpdate(
        { email },
        {
          isActive,
        }
      );
      res
        .status(200)
        .json({ msg: 'Congratulations, your account has been activated' });
    } else {
      return res.status(400).json({ msg: 'Account is already been actived' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        msg: 'Your account activation is already been expired. We will send another activation link on your email address.',
        sendAnotherToken: true,
      });
    }
  }
};

export const reActivateAccount = async (req, res) => {
  try {
    const { email } = req.body;

    const chkEmail = await accountModel.findOne({ email });
    const { isAdmin, password, firstName, lastName } = chkEmail;
    const activationToken = createActivationToken({
      isAdmin,
      email,
      password,
      firstName,
      lastName,
    });

    const account = { isAdmin, email, password, firstName, lastName };

    sendEmailConfirmation({
      receiver: account,
      activationToken,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const loginAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const chkAccount = await accountModel.findOne({ email: email });

    if (!chkAccount)
      return res
        .status(404)
        .json({ email: { msg: 'This email is not registered' } });
    if (!chkAccount.isActive)
      return res.status(401).json({
        msg: 'The Account is not yet activated. \r\n Please check your email for account activation link',
      });
    if (chkAccount && (await chkAccount.matchPassword(password))) {
      chkAccount.onlineStatus = 'online';

      const accountTeam = await teamModel.find({
        $or: [
          {
            teamLeadId: { $in: chkAccount._id },
          },
          {
            invitedPeopleId: { $in: chkAccount._id },
          },
        ],
      });

      await chkAccount.save({
        validateBeforeSave: false,
      });

      res.status(200).json({
        _id: chkAccount._id,
        isAdmin: chkAccount.isAdmin,
        email: chkAccount.email,
        firstName: chkAccount.firstName,
        lastName: chkAccount.lastName,
        jobTitle: chkAccount.jobTitle,
        departmentId: chkAccount.departmentId,
        accountProfileUploaded: chkAccount.accountProfileUploaded,
        tokenId: createRefreshToken(chkAccount._id),
        currentTeam: accountTeam,
      });
    } else {
      return res.status(404).json({
        password: { msg: 'Incorrect Password' },
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const chkEmail = await accountModel.findOne({ email });

    if (!chkEmail)
      return res
        .status(404)
        .json({ email: { msg: 'This email is not registered to our system' } });

    const resetToken = chkEmail.getResetPasswordToken();

    sendEmailResetToken({
      receiver: chkEmail,
      resetToken,
    });

    await chkEmail.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      msg: 'Please check your inbox. We have send a password recover instruction to your email.',
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.body.resetToken)
    .digest('hex');

  const password = req.body.password;

  try {
    const chkAccount = await accountModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!chkAccount || chkAccount === null)
      return res.status(401).json({
        msg: 'Please request another password reset. \n Because your token is already been expired.',
      });

    if (await chkAccount.matchPassword(password)) {
      return res.status(400).json({
        password: {
          msg: 'Your new password cannot be the same as your current password',
        },
      });
    }

    chkAccount.password = password;
    chkAccount.resetPasswordToken = undefined;
    chkAccount.resetPasswordExpire = undefined;

    await chkAccount.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      msg: 'You can now use your new password to log in\r\nto your account.',
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAccounts = async (req, res) => {
  const accounts = await accountModel.find({});
  res.status(200).json(accounts);
};

export const getAccount = async (req, res) => {
  try {
    const chkAccount = await accountModel.findById(req.accountInfo._id);
    if (chkAccount) {
      res.status(200).json({
        _id: chkAccount._id,
        isAdmin: chkAccount.isAdmin,
        email: chkAccount.email,
        firstName: chkAccount.firstName,
        lastName: chkAccount.lastName,
        jobTitle: chkAccount.workInfo.jobTitle,
        departmentId: chkAccount.workInfo.departmentId,
        location: chkAccount.location,
        contact: chkAccount.contact,
        accountProfileUploaded: chkAccount.accountProfileUploaded,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const accountId = await accountModel.findById(req.params.userId);

    if (accountId) {
      res.status(200).json({
        _id: accountId._id,
        isadmin: accountId.isadmin,
        email: accountId.email,
        firstName: accountId.firstName,
        lastName: accountId.lastName,
        jobTitle: accountId.workInfo.jobTitle,
        departmentId: accountId.workInfo.departmentId,
        location: accountId.location,
        contact: accountId.contact,
        accountProfileUploaded: accountId.accountProfileUploaded,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateAccount = async (req, res) => {
  const {
    _id,
    isadmin,
    email,
    firstName,
    lastName,
    jobTitle,
    departmentId,
    location,
    contact,
    accountProfileUploaded,
  } = req.body;
  try {
    const chkAccountInfo = await accountModel.findOne({ _id });
    const existingAccntInfo = chkAccountInfo;

    if (chkAccountInfo) {
      const updatedInfo = await accountModel.findOne({ email });
      if (updatedInfo) {
        if (existingAccntInfo.email !== updatedInfo.email) {
          return res.status(400).json({
            email: {
              msg: 'Email already exists',
            },
          });
        }

        if (!isEmailValid(email)) {
          return res
            .status(400)
            .json({ msg: 'You must provide a valid email address' });
        }

        if (!isNameValid(firstName)) {
          return res.status(400).json({
            firstName: { msg: 'Your firstname must only contain letters only' },
          });
        }

        if (!isNameValid(lastName)) {
          return res.status(400).json({
            lastName: { msg: 'Your lastname must only contain letters only' },
          });
        }

        updatedInfo.email = email || updatedInfo.email;
        updatedInfo.isadmin = isadmin || updatedInfo.isadmin;
        updatedInfo.firstName = firstName || updatedInfo.firstName;
        updatedInfo.lastName = lastName || updatedInfo.lastName;
        updatedInfo.updatedAt = Date.now || updatedInfo.updatedAt;
        updatedInfo.workInfo.jobTitle =
          jobTitle || updatedInfo.workInfo.jobTitle;
        updatedInfo.workInfo.departmentId =
          departmentId || updatedInfo.workInfo.departmentId;
        updatedInfo.location = location || updatedInfo.location;
        updatedInfo.contact = contact || updatedInfo.contact;
        updatedInfo.accountProfileUploaded =
          accountProfileUploaded || updatedInfo.accountProfileUploaded;
        updatedInfo.updatedAt = Date.now || updatedInfo.updatedAt;

        const updatedAccntInfo = await updatedInfo.save({
          validateBeforeSave: false,
        });

        res.status(200).json({
          _id: updatedAccntInfo._id,
          isadmin: updatedAccntInfo.isadmin,
          email: updatedAccntInfo.email,
          firstName: updatedAccntInfo.firstName,
          lastName: updatedAccntInfo.lastName,
          jobTitle: updatedAccntInfo.workInfo.jobTitle,
          departmentId: updatedAccntInfo.workInfo.departmentId,
          location: updatedAccntInfo.location,
          accountProfileUploaded: updatedAccntInfo.accountProfileUploaded,
          msg: 'Your profile has been updated',
        });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateAccountPassword = async (req, res) => {
  try {
    const { _id, currentPassword, password } = req.body;

    const chkAccountInfo = await accountModel.findOne({ _id });

    if (currentPassword) {
      if (
        chkAccountInfo &&
        (await chkAccountInfo.matchPassword(currentPassword))
      ) {
        if (await chkAccountInfo.matchPassword(password)) {
          return res.status(401).json({
            password: { msg: `Please don't use your current password` },
          });
        }

        chkAccountInfo.password = password || chkAccountInfo.password;

        await chkAccountInfo.save({
          validateBeforeSave: false,
        });

        res.status(200).json({
          msg: 'Your password has been updated',
        });
      } else {
        return res.status(404).json({
          msg: 'Incorrect Password',
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const uploadAccountProfile = async (req, res) => {
  res.status(200).json({
    profilePicture: `${process.env.SERVER_DOMAIN}/${req.file.path.replace(
      /\\/g,
      '/'
    )}`,
    msg: 'Account Profile is uploaded',
  });
};
