import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import validator from 'validator';

const accountSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide apassword'],
    minlength: [6, 'Password must be at least 6 characters'],
    maxlength: [22, 'Password must be at most 22 characters'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide a firstname'],
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [22, 'First name must be at most 22 characters'],
  },
  lastName: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  workInfo: {
    jobTitle: { type: String },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'departmentModel',
    },
  },
  location: {
    type: String,
  },
  contact: {
    type: Number,
  },
  accountProfileUploaded: {
    type: String,
  },
  onlineStatus: {
    type: String,
    enum: ['online', 'away', 'offline'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

//Hash the password
accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

//Check the hash password
accountSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Create password reset token
accountSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const accountModel = mongoose.model('accountModel', accountSchema);

export default accountModel;
