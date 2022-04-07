import express from 'express';

import {
  registerDepartment,
  getDepartmentById,
  getDepartmentList,
  registerClient,
  getClientList,
  registerTeam,
  getTeamById,
  getTeamsList,
} from '../controllers/utilitiesController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/department/register').post(auth, registerDepartment);
router.route('/department/list').get(auth, getDepartmentList);
router.route('/department/:departmentId').get(auth, getDepartmentById);
router.route('/client/register').post(auth, registerClient);
router.route('/client/list').get(auth, getClientList);
router.route('/team/register').post(auth, registerTeam);
router.route('/team/list').get(auth, getTeamsList);
router.route('/team/view/:teamId').get(auth, getTeamById);

export default router;
