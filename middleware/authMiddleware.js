import jwt from 'jsonwebtoken';
import accountModel from '../models/accountModel.js';

export const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      req.accountInfo = await accountModel
        .findById(decodedToken.id)
        .select('-password');
      next();
    } catch (error) {
      res.status(400).json(error.responsse);
    }
  }
  if (!token) {
    res.status(400).json({ msg: 'Invalid Authorization' });
  }
};
