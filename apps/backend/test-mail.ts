import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, '.env') });

const testMail = async () => {
  console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
  // Log masked password
  const pass = process.env.EMAIL_PASS || '';
  console.log('Using EMAIL_PASS:', pass ? `${pass.substring(0, 3)}...${pass.substring(pass.length - 3)}` : 'MISSING');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'romit9011@gmail.com',
      subject: 'Test Email from Backend',
      text: 'If you are receiving this, the backend email configuration is working!',
    });
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

testMail().catch(console.error);
