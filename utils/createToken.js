import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//Create Activation Token
export const createActivationToken = (id) => {
  console.log(id);
  return jwt.sign(id, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: process.env.ACTIVATION_TOKEN_EXPIRES_IN,
  });
};

// Create JWT Refresh Token
export const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};
