import { sendMail } from '../config/mailer';
import { logger } from '../utils/logger';

const sendViaResend = async (options: { to: string; subject: string; html: string; text: string }) => {
  // Uses Resend API via native fetch
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Resend Error: ${JSON.stringify(errorData)}`);
  }
  return res.json();
};

const sendVerificationEmail = async (email: string, token: string) => {
  const subject = 'Please verify your email address';
  const text = `Click the link to verify your email: ${process.env.FRONTEND_URL}/verifymail/${token}`;
  const html = `<p>Click the link to verify your email: <a href="${process.env.FRONTEND_URL}/verifymail/${token}">Verify Email</a></p>`;

  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend({ to: email, subject, text, html });
      console.log(`\n📬 [RESEND API] Verification email sent to: ${email}\n`);
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text,
        html,
      };
      const info = await sendMail(mailOptions) as any;
      if (info.testMessageUrl) {
        console.log(`\n📬 [TEST MAIL] Preview URL: ${info.testMessageUrl}\n`);
      }
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🚀 [DEV] Verification Link: ${process.env.FRONTEND_URL}/verifymail/${token}\n`);
    }
  }
};

const sendPassowrdResetEmail = async (email: string, token: string) => {
  const subject = 'Please use below link to reset your password';
  const text = `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `<p>Click the link to reset your password: <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a></p>`;

  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend({ to: email, subject, text, html });
      console.log(`\n📬 [RESEND API] Password reset email sent to: ${email}\n`);
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text,
        html,
      };
      const info = await sendMail(mailOptions) as any;
      if (info.testMessageUrl) {
        console.log(`\n📬 [TEST MAIL] Preview URL: ${info.testMessageUrl}\n`);
      }
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🔑 [DEV] Password Reset Link: ${process.env.FRONTEND_URL}/reset-password/${token}\n`);
    }
  }
};

export { sendVerificationEmail, sendPassowrdResetEmail };
