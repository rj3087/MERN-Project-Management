import express from 'express';

import {
  registerNotifications,
  getTaskNotificationByUserId,
  updateNotificationStatusById,
  updateNotificationNameLink,
} from '../controllers/notificationController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(auth, registerNotifications);
router.route('/:receiverId').get(auth, getTaskNotificationByUserId);
router.route('/').put(auth, updateNotificationNameLink);
router.route('/:notifId').put(auth, updateNotificationStatusById);

export default router;
