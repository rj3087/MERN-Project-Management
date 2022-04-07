import accountModel from '../models/accountModel.js';
import notificationModel from '../models/notificationModel.js';

export const registerNotifications = async (req, res) => {
  try {
    const {
      senderInfo,
      receiverId,
      category,
      name,
      type,
      content,
      link,
      createdAt,
      seen,
    } = req.body;
    if (receiverId) {
      const notification = new notificationModel({
        senderInfo,
        receiverId,
        category,
        name,
        type,
        content,
        link,
        createdAt,
        seen,
      });

      const sender = await accountModel
        .findById(receiverId)
        .populate('receiverId');

      await notification.save();

      res.status(200).json({
        receiverId: receiverId,
        senderInfo: sender,
        category: category,
        name: name,
        type: type,
        content: content,
        link: link,
        createdAt: createdAt,
        seen: seen,
      });
    } else {
      console.log(`Notificaton don't have ${receiverId}`);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTaskNotificationByUserId = async (req, res) => {
  try {
    const notificationByUserId = await notificationModel.find({
      receiverId: req.params.receiverId,
    });

    res.status(200).json(notificationByUserId);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// export const registerTaskDescNotif = async (req, res) => {
//   try {
//     const { senderInfo, receiverId, content, name, link, createdAt } = req.body;

//     if (receiverId) {
//       const notification = new notificationModel({
//         senderInfo,
//         receiverId,
//         content,
//         name,
//         link,
//         createdAt,
//       });

//       await notification.save();

//       res.status(200).json({
//         _id: notification._id,
//         msg: 'You receive a notification',
//       });
//     } else {
//       console.log(`Notificaton don't have ${receiverId}`);
//     }
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       let errors = {};

//       Object.keys(error.errors).forEach((key) => {
//         errors[key] = error.errors[key].message;
//       });

//       return res.status(400).send(errors);
//     }
//     res.status(500).json({ msg: error.message });
//   }
// };

// export const getTaskDescNotifById = async (req, res) => {
//   try {
//     const notification = await notificationModel.find({
//       receiverId: req.params.receiverId,
//     });

//     res.status(200).json(notification);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const updateNotificationStatusById = async (req, res) => {
  try {
    const notification = await notificationModel.findById(req.params.notifId);

    if (notification) {
      notification.seen = true || notification.seen;
    }

    const updatedNotifStatus = await notification.save({
      validateBeforeSave: false,
    });

    res.status(200).json(updatedNotifStatus);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateNotificationNameLink = async (req, res) => {
  try {
    const updateNotifNameLink = await notificationModel.updateMany(
      { referenceId: { $in: req.body._id } },
      { $set: { name: req.body.taskName, link: req.body.taskName } }
    );

    // if (notification) {
    //   notification.seen = true || notification.seen;
    // }
    // const updatedNotifStatus = await notification.save({
    //   validateBeforeSave: false,
    // });
    // res.status(200).json(updatedNotifStatus);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
