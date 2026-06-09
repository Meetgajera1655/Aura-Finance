const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(process.cwd(), 'firebaseAdmin.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://aurafinance-6d710-default-rtdb.asia-southeast1.firebasedatabase.app'
  });
}

const rtdb = admin.database();

async function createPlaceholders() {
  const tables = [
    'lessons', 
    'learningPaths', 
    'skillChallenges', 
    'rewards', 
    'passwordResetTokens'
  ];

  for (const table of tables) {
    // Check if the table already has data
    const snapshot = await rtdb.ref(table).once('value');
    if (!snapshot.exists()) {
      // Create a dummy placeholder so the table appears in the Firebase console
      await rtdb.ref(`${table}/_placeholder`).set(
        "This is an empty table placeholder. It will be removed once real data is added."
      );
      console.log(`Created placeholder for table: ${table}`);
    }
  }
  
  console.log('Finished setting up empty tables!');
  process.exit(0);
}

createPlaceholders();
