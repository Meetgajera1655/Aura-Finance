import jwt from 'jsonwebtoken';
import {config} from 'dotenv';

config();

export const generateTokens = (userId: String) => {
  const accessSecret = process.env.ACCESS_JWT_SECRET || 'fallback_insecure_secret';
  const refreshSecret = process.env.REFRESH_JWT_SECRET || 'fallback_refresh_secret';
  
  const accessToken = jwt.sign({ id: userId }, accessSecret, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};
