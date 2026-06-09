import { NextFunction, Request, Response } from 'express';
import {
  createUser,
  saveEmailVerificationToken,
  verifyEmailToken,
  getUserByEmail,
  getUserById,
} from '../../apps/backend/src/helpers/data';
import { rtdb } from '../../apps/backend/src/config/firebase';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../../apps/backend/src/utils/generateTokens';
import { generateVerificationToken } from '../../apps/backend/src/helpers/generateVerificationToken';
import { AuthRequest } from '../../apps/backend/src/types/authType';
import {
  sendPassowrdResetEmail,
  sendVerificationEmail,
} from '../../apps/backend/src/utils/sendEmail';
import pkg from 'jsonwebtoken';
import { logger } from '../../apps/backend/src/utils/logger';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../apps/backend/src/errors/errorTypes';

const { verify } = pkg;

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return next(new ConflictError('User already exists with this email'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
      emailVerified: null,
    });

    if (newUser) {
      const verificationToken = generateVerificationToken();
      await saveEmailVerificationToken(newUser.id, verificationToken);
      await sendVerificationEmail(newUser.email, verificationToken);
      
      res.status(200).json({
        message: 'Sent verification email',
        isVerified: false,
        success: true,
      });
      return;
    }

    return next(new InternalServerError('Unexpected error occurred while creating user'));
  } catch (err: any) {
    logger.error('Failed to sign up user', { error: err.message, stack: err.stack });
    return next(new InternalServerError(err.message || 'Error while processing your request'));
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return next(new NotFoundError('User with email not found'));
    }

    if (!user.emailVerified) {
      return next(new UnauthorizedError('Please verify your email address before signing in'));
    }

    if (!user.password) {
      return next(new BadRequestError('Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      return next(new BadRequestError('Invalid credentials'));
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({ accessToken, user: { username: user.username, email: user.email, id: user.id, name: user.name, bio: user.bio, image: user.image }, isVerified: true, success: true });
  } catch (error: any) {
    logger.error('Failed to sign in user', { error: error.message, stack: error.stack });
    return next(new InternalServerError(error.message || 'Error while processing your request'));
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  try {
    const user = await verifyEmailToken(token);

    if (user) {
      res.status(200).json({
        Code: 'VERIFIED',
        message: 'Email Verified Successfully',
        success: true,
      });
    } else {
      return next(
        new BadRequestError("We couldn't verify your email. The link may have expired or is invalid.")
      );
    }
  } catch (err) {
    logger.error('Failed to verify email token', { error: err });
    return next(new BadRequestError('Unknown error occurred during token verification.'));
  }
};

const generateResetToken = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(200).json({ message: 'Email not registered' });
      return;
    }

    const resetToken = generateVerificationToken();
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getMinutes() + 24);

    const tokensRef = rtdb.ref('passwordResetTokens');
    await tokensRef.push().set({
      userId: user.id,
      token: resetToken,
      expireAt: tokenExpiration.toISOString(),
      isUsed: false
    });

    await sendPassowrdResetEmail(email, resetToken);
    res.status(200).json({ message: 'Sent Password reset link to registered email.' });
  } catch (error) {
    logger.error('Failed to generate password reset token', { error });
    return next(new InternalServerError('An Unknown error occurred during password reset'));
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const tokensRef = rtdb.ref('passwordResetTokens');
    const snapshot = await tokensRef.orderByChild('token').equalTo(token).once('value');
    if (!snapshot.exists()) {
      return next(new BadRequestError('Invalid reset token'));
    }

    const tokens = snapshot.val();
    const tokenId = Object.keys(tokens)[0];
    const resetToken = tokens[tokenId];

    if (password !== confirmPassword) {
      return next(new BadRequestError('Password does not match'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await rtdb.ref(`users/${resetToken.userId}`).update({
      password: hashedPassword,
    });

    await rtdb.ref(`passwordResetTokens/${tokenId}`).update({
      isUsed: true,
    });

    res.status(200).json({ Code: 'RESET_SUCCESSFUL', success: true });
  } catch (error) {
    logger.error('Failed to reset password', { error });
    return next(new InternalServerError('An Unknown error occurred during password reset.'));
  }
};

const verifyResetToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  try {
    const tokensRef = rtdb.ref('passwordResetTokens');
    const snapshot = await tokensRef.orderByChild('token').equalTo(token).once('value');
    if (!snapshot.exists()) {
      res.status(200).json({ Code: 'INVALID_TOKEN', success: true });
      return;
    }

    const tokens = snapshot.val();
    const tokenId = Object.keys(tokens)[0];
    const resetToken = tokens[tokenId];

    const now = new Date();
    if (now > new Date(resetToken.expireAt) || resetToken.isUsed) {
      res.status(200).json({ Code: 'INVALID_TOKEN', success: true });
      return;
    }

    res.status(200).json({ Code: 'VALID_TOKEN', success: true });
  } catch (error) {
    logger.error('Failed to verify reset token', { error });
    return next(new InternalServerError('An Unknown error occurred during token verification'));
  }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ message: 'No session found' });
      return;
    }

    verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET!,
      async (err: Error | null, decoded: unknown) => {
        if (err || !decoded || typeof decoded === 'string') {
          return next(new UnauthorizedError('Invalid or expired refresh token'));
        }

        const payload = decoded as { id?: string };
        if (!payload.id) {
          return next(new UnauthorizedError('Invalid or expired refresh token'));
        }

        const user = await getUserById(payload.id);
        if (!user) {
          return next(new UnauthorizedError('User not found'));
        }

        const { accessToken, accessToken: newAccessToken } = generateTokens(user.id);

        res.json({ accessToken: newAccessToken, user: { username: user.username, email: user.email, id: user.id, name: user.name, bio: user.bio, image: user.image } });
      }
    );
  } catch (error) {
    logger.error('Failed to refresh token', { error });
    return next(new InternalServerError('Error refreshing token'));
  }
};

const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;

  const { accessToken, refreshToken } = generateTokens(_req.user.id);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

const githubCallback = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;
  const { accessToken, refreshToken } = generateTokens(_req.user.id);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _req = req as AuthRequest;
    const userId = _req.user?.id;
    if (!userId) {
      return next(new ForbiddenError('User not authenticated'));
    }

    const { name, bio, image } = req.body;

    const updates: any = { name, bio };
    if (image) updates.image = image;

    await rtdb.ref(`users/${userId}`).update(updates);
    const updatedUser = await getUserById(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        username: updatedUser?.username,
        email: updatedUser?.email,
        id: updatedUser?.id,
        name: updatedUser?.name,
        bio: updatedUser?.bio,
        image: updatedUser?.image,
      },
    });
  } catch (error) {
    logger.error('Failed to update profile', { error });
    return next(new InternalServerError('Error updating profile'));
  }
};

export {
  signup,
  signin,
  verifyEmail,
  googleCallback,
  githubCallback,
  resetPassword,
  refreshToken,
  generateResetToken,
  verifyResetToken,
  updateProfile,
};
