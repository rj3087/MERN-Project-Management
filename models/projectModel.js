import mongoose from 'mongoose';
import validator from 'validator';

const projectSchema = mongoose.Schema({
  projectCategory: {
    type: String,
    required: [true, 'Please provide the project category'],
  },
  projectCreatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  projectName: {
    type: String,
    required: [true, 'Please provide the project name'],
  },
  projectClientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clientModel',
  },
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  projectNote: {
    type: String,
  },
  projectType: {
    type: String,
    required: [true, 'Please select the type of the project'],
  },
  rate: {
    type: String,
    // required: [true, 'Please provide the rate'],
  },
  amount: {
    type: Number,
  },
  budget: {
    type: String,
    // required: [true, 'Please provide the budget'],
  },
  whoCanEdit: {
    type: String,
    required: [true, 'Please provide who can edit the project'],
  },
  whoCanEditId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  lastUpdate: {
    date: { type: Date, default: Date.now },
    account: { type: String },
  },
  lastOpened: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const projectModel = mongoose.model('projectModel', projectSchema);

export default projectModel;
