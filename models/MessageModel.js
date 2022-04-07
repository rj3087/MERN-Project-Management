import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accountModel',
  },
  messageText: {
    type: String,
  },
  messageMedia: [
    {
      type: String,
    },
  ],
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const messageModel = mongoose.model('messageModel', messageSchema);

export default messageModel;
