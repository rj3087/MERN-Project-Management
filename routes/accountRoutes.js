import express from 'express';
import {
  registerAccount,
  activateAccount,
  reActivateAccount,
  loginAccount,
  forgotPassword,
  resetPassword,
  getAccount,
  getAccountById,
  getAccounts,
  updateAccount,
  updateAccountPassword,
  uploadAccountProfile,
} from '../controllers/accountController.js';

import { auth } from '../middleware/authMiddleware.js';

import uploadProfileMiddleware from '../middleware/uploadProfileMiddleware.js';

const router = express.Router();
router.get('/', auth, getAccounts);
router.post('/register', registerAccount);
router.post('/activation-account/:activationToken', activateAccount);
router.post('/reactivation', reActivateAccount);
router.post('/login', loginAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router
  .get('/profile', auth, getAccount)
  .get('/:userId', getAccountById)
  .put('/:resetToken', auth, updateAccount);
router.put('/profile/change-password', auth, updateAccountPassword);
router.post('/profile/upload', uploadProfileMiddleware, uploadAccountProfile);

export default router;
