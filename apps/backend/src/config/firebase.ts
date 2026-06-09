import * as admin from 'firebase-admin';
import path from 'path';

// For local development, we expect a firebaseAdmin.json file at the root of the backend folder.
let serviceAccount: any;

try {
  serviceAccount = require(path.join(process.cwd(), 'firebaseAdmin.json'));
} catch (error) {
  console.warn('firebaseAdmin.json not found, using default application credentials if available.');
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
