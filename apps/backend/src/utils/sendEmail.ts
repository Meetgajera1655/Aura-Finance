import { sendMail } from '../config/mailer';
import { logger } from '../utils/logger';

const sendVerificationEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please verify your email address',
    text: `Click the link to verify your email: ${process.env.FRONTEND_URL}/verifymail/${token}`,
  };

  try {
    const info = await sendMail(mailOptions) as any;
    if (info.testMessageUrl) {
      console.log(`\n📬 [TEST MAIL] Preview URL: ${info.testMessageUrl}\n`);
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🚀 [DEV] Verification Link: ${process.env.FRONTEND_URL}/verifymail/${token}\n`);
    }
  }
};

const sendPassowrdResetEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please use below link to reset your password',
    text: `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${token}`,
  };

  try {
    const info = await sendMail(mailOptions) as any;
    if (info.testMessageUrl) {
      console.log(`\n📬 [TEST MAIL] Preview URL: ${info.testMessageUrl}\n`);
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🔑 [DEV] Password Reset Link: ${process.env.FRONTEND_URL}/reset-password/${token}\n`);
    }
  }
};

export { sendVerificationEmail, sendPassowrdResetEmail };
