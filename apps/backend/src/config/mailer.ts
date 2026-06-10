import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const createTransporter = async () => {
  if (process.env.EMAIL_USER === 'dummy@gmail.com') {
    // For development/testing: use ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    console.log(`\n📧 [TEST MAIL] Using Ethereal account: ${testAccount.user}\n`);
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

const transporterPromise = createTransporter();

// Helper to send mail via the promised transporter
export const sendMail = async (options: any) => {
  const transporter = await transporterPromise;
  return transporter.sendMail(options);
};

export default transporterPromise;
