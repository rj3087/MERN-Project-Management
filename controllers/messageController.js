import messageModel from '../models/messageModel.js';

export const registerMessage = async (req, res) => {
  const { conversationId, senderId, messageText, messageMedia } = req.body;

  try {
    const message = new messageModel({
      conversationId,
      senderId,
      messageText,
      messageMedia,
    });

    await message.save();

    res.status(200).json({
      conversationId: message.conversationId,
      senderId: message.senderId,
      messageText: message.messageText,
      msg: 'New message added',
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

export const getMessage = async (req, res) => {
  try {
    const message = await messageModel
      .find({
        conversationId: req.params.messageId,
      })
      .populate('senderId');

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const message = await messageModel.find().populate('senderId');

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateMessageSeen = async (req, res) => {
  try {
    if (Array.isArray(req.body) && req.body.length > 0) {
      await messageModel.updateMany(
        { senderId: req.body[0].senderId._id },
        { seen: true }
      );
      res.status(200);
    } else {
      res.status(400);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const uploadMessageAttachments = async (req, res) => {
  try {
    const reqFiles = [];

    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(
        `${process.env.SERVER_DOMAIN}/${req.files[i].path.replace(/\\/g, '/')}`
      );
    }

    res.status(200).json(reqFiles);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
