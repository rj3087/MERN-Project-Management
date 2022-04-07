import express from 'express';

import {
  registerTask,
  getTaskById,
  getTaskByName,
  getTaskList,
  deleteTaskById,
  updateTaskStatusById,
  updateTaskById,
  uploadTaskAttachments,
  deleteTaskAttachment,
  deleteTaskFileAttachmentFile,
} from '../controllers/taskController.js';
import { auth } from '../middleware/authMiddleware.js';
import uploadAttachmentsMiddleware from '../middleware/uploadAttachmentsMiddleware.js';

const router = express.Router();
router.route('/register').post(auth, registerTask);
router.route('/').get(getTaskList);
router
  .route('/:id')
  .get(auth, getTaskById)
  .delete(auth, deleteTaskById)
  .put(auth, updateTaskStatusById)
  .put(auth, updateTaskById);
router.route('/browse/:taskLink').get(auth, getTaskByName);
router.route('/update/:id').put(auth, updateTaskById);
router
  .route('/upload')
  .post(uploadAttachmentsMiddleware, uploadTaskAttachments);
router.route('/delete/:path/:name').delete(auth, deleteTaskAttachment);
router.route('/:id/:name').put(auth, deleteTaskFileAttachmentFile);

export default router;
