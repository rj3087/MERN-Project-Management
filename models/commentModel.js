import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'taskModel',
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  taskComment: {
    content: {
      type: String,
    },
    mentions: {
      type: Array,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

const commentModel = mongoose.model('commentModel', commentSchema);

export default commentModel;
