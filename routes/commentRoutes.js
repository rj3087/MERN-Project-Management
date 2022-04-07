import express from 'express';

import {
  registerTaskComment,
  getTaskCommentById,
} from '../controllers/commentController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/post').post(auth, registerTaskComment);
router.route('/:taskId').get(auth, getTaskCommentById);

export default router;
