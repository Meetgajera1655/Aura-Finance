import * as admin from 'firebase-admin';
import path from 'path';

let serviceAccount: any;
serviceAccount = require(path.join(process.cwd(), 'firebaseAdmin.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://aurafinance-6d710-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const rtdb = admin.database();

const test = async () => {
  console.log('Testing set...');
  const tokensRef = rtdb.ref('emailVerificationTokens');
  const newTokenRef = tokensRef.push();
  const data = {
    userId: 'testId',
    token: 'testToken',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
  await newTokenRef.set(data);
  console.log('Done!');
  process.exit(0);
};

test().catch(console.error);
