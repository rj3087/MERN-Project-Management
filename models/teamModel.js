import mongoose from 'mongoose';

const teamSchema = mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projectModel',
  },
  teamName: {
    type: String,
    required: [true, 'Please provide a department name'],
    minlength: [6, 'Department name must be at least 6 characters'],
    maxlength: [64, 'Department name must be at most 32 characters'],
  },
  teamEmail: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  teamDepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'departmentModel',
  },
  teamLeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  teamDescription: {
    type: String,
  },
  invitedPeopleId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'accountModel',
    },
  ],
  lastUpdate: {
    date: { type: Date, default: Date.now },
    account: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const teamModel = mongoose.model('teamModel', teamSchema);

export default teamModel;
