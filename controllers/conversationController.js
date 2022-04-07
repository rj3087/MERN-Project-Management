import conversationModel from '../models/conversationModel.js';

export const registerConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const conversation = new conversationModel({
      members: [senderId, receiverId],
    });

    await conversation.save();

    res.status(200).json({
      _id: conversation._id,
      members: conversation.members,
      msg: 'New conversation added',
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

export const getConversation = async (req, res) => {
  try {
    const conversation = await conversationModel.find({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
