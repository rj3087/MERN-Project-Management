import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  receiverId: {
    type: Array,
  },
  senderInfo: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'accountModel' },
    email: { type: String },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    accountProfileUploaded: {
      type: String,
    },
  },
  referenceId: {
    type: String,
  },
  category: {
    type: String,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  content: {
    type: String,
  },
  link: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

const notificationModel = mongoose.model(
  'notificationModel',
  notificationSchema
);

export default notificationModel;
