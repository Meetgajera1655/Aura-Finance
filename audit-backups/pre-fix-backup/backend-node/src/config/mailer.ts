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
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporterPromise = createTransporter();

// Helper to send mail via the promised transporter
export const sendMail = async (options: any) => {
  const transporter = await transporterPromise;
  return transporter.sendMail(options);
};

export default transporterPromise;
