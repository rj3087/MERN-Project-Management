import express from 'express';
import {
  registerMessage,
  getMessage,
  getMessages,
  updateMessageSeen,
  uploadMessageAttachments,
} from '../controllers/messageController.js';
import uploadMessageAttachmentsMiddleware from '../middleware/uploadMessageAttachmentsMiddleware.js';

const router = express.Router();

router.route('/').post(registerMessage).get(getMessages);
router.get('/:messageId', getMessage);
router
  .route('/upload')
  .post(uploadMessageAttachmentsMiddleware, uploadMessageAttachments);
router.put('/seen', updateMessageSeen);

export default router;
