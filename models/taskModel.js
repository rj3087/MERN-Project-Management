import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projectModel',
  },
  taskCreatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  taskStatus: {
    type: String,
    default: 'Proposed',
  },
  taskName: {
    type: String,
    required: [true, 'Please task name'],
  },
  taskNote: {
    content: {
      type: String,
    },
    mentions: {
      type: Array,
    },
  },
  dueDate: {
    type: String,
  },
  priority: {
    type: String,
  },
  taskType: {
    type: String,
    // required: [true, 'Please project name type'],
  },
  taskAssigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  taskReporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  attachments: [
    {
      fileThumbnail: { type: String },
      name: { type: String },
      size: { type: Number },
      uploadDate: { type: String },
      status: {
        type: Boolean,
        default: true,
      },
    },
  ],
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

const taskModel = mongoose.model('taskModel', taskSchema);

export default taskModel;
