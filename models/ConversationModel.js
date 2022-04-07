import mongoose from 'mongoose';

const conversationSchema = mongoose.Schema({
  members: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const conversationModel = mongoose.model(
  'conversationModel',
  conversationSchema
);

export default conversationModel;
