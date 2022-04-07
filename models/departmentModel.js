import mongoose from 'mongoose';
import validator from 'validator';

const departmentSchema = mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projectModel',
  },
  departmentHeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  departmentName: {
    type: String,
    required: [true, 'Please provide a department name'],
    minlength: [6, 'Department name must be at least 6 characters'],
    maxlength: [64, 'Department name must be at most 32 characters'],
  },
  departmentEmail: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  lastUpdate: {
    date: { type: Date, default: Date.now },
    account: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const departmentModel = mongoose.model('departmentModel', departmentSchema);

export default departmentModel;
