import commentModel from '../models/commentModel.js';

export const registerTaskComment = async (req, res) => {
  try {
    const { taskId, commentId, taskComment, createdAt } = req.body;

    if (taskId) {
      const comment = new commentModel({
        taskId,
        commentId,
        taskComment,
        createdAt,
      });

      await comment.save();

      res.status(200).json({
        _id: comment._id,
        msg: 'You comment is successful posted',
      });
    }
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

export const getTaskCommentById = async (req, res) => {
  try {
    const commentListById = await commentModel
      .find()
      .where('taskId')
      .in(req.params.taskId)
      .populate('commentId');

    res.status(200).json(commentListById);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
