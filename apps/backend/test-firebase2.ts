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
  console.log(Date.now(), 'Testing users set...');
  const usersRef = rtdb.ref('users');
  const newUserRef = usersRef.push();
  const data = {
    test: 'test'
  };
  console.log(Date.now(), 'Calling set()...');
  await newUserRef.set(data);
  console.log(Date.now(), 'Done users set!');
  process.exit(0);
};

test().catch(console.error);
