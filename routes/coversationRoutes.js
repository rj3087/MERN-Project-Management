import express from 'express';
import {
  registerConversation,
  getConversation,
} from '../controllers/conversationController.js';

const router = express.Router();

router.post('/register', registerConversation);
router.get('/:userId', getConversation);

export default router;
