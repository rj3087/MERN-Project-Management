import express from 'express';

import {
  registerProject,
  getProjectList,
  getProjectById,
  getProjectTaskListById,
  updateProjectById,
  deleteProjectById,
} from '../controllers/projectController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/register').post(auth, registerProject);
router.route('/').get(getProjectList);
router
  .route('/:id')
  .get(auth, getProjectById)
  .put(auth, updateProjectById)
  .delete(auth, deleteProjectById);
router.route('/board/:id/').get(auth, getProjectTaskListById);

export default router;
