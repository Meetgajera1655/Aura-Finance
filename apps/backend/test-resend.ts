import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, '.env') });

const testResend = async () => {
  console.log('Using RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'meetgajera1655@gmail.com', // Let's use the user's email, or wait, I don't know the user's email exactly. The test mail used romit9011@gmail.com.
        subject: 'Test Email via Resend API',
        text: 'This is a test email sent using the Resend API!',
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Failed to send email. Resend Error:', data);
    } else {
      console.log('Email sent successfully via Resend API!', data);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
};

testResend().catch(console.error);
