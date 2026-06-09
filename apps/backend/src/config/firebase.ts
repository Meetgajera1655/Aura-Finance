import * as admin from 'firebase-admin';
import path from 'path';

// For local development, we expect a firebaseAdmin.json file at the root of the backend folder.
let serviceAccount: any;

try {
  serviceAccount = require(path.join(process.cwd(), 'firebaseAdmin.json'));
} catch (error) {
  console.warn('firebaseAdmin.json not found, checking environment variables.');
  
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  } else {
    console.warn('Firebase env variables not completely set, falling back to applicationDefault()');
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    databaseURL: 'https://aurafinance-6d710-default-rtdb.asia-southeast1.firebasedatabase.app'
  });
}

const rtdb = admin.database();
const db = admin.firestore();

export { admin, rtdb, db };
