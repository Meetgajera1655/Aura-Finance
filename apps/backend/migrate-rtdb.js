require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(process.cwd(), 'firebaseAdmin.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://aurafinance-6d710-default-rtdb.asia-southeast1.firebasedatabase.app'
  });
}

const db = admin.firestore();
const rtdb = admin.database();

const prisma = new PrismaClient();

async function deleteFromFirestore() {
  console.log('Deleting from Firestore...');
  const collections = ['users', 'lessons', 'learningPaths', 'skillChallenges', 'rewards', 'emailVerificationTokens', 'passwordResetTokens'];
  
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
  console.log('Firestore data deleted.');
}

async function migrateUsers() {
  console.log('Migrating Users to RTDB...');
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
      educationProgress: true,
      achievements: true,
      skillTrees: true,
    }
  });

  const updates = {};
  for (const user of users) {
    const userCopy = JSON.parse(JSON.stringify(user));
    updates[`users/${user.id}`] = userCopy;
  }
  await rtdb.ref().update(updates);
  console.log(`Migrated ${users.length} users to RTDB.`);
}

async function migrateLessons() {
  console.log('Migrating Lessons to RTDB...');
  const lessons = await prisma.lesson.findMany({
    include: {
      quizzes: {
        include: { questions: true }
      },
      flashcardDecks: {
        include: { flashcards: true }
      }
    }
  });

  const updates = {};
  for (const lesson of lessons) {
    const lessonCopy = JSON.parse(JSON.stringify(lesson));
    updates[`lessons/${lesson.id}`] = lessonCopy;
  }
  await rtdb.ref().update(updates);
  console.log(`Migrated ${lessons.length} lessons to RTDB.`);
}

async function migrateStandalone(modelName, collectionName) {
  console.log(`Migrating ${modelName} to RTDB...`);
  const records = await prisma[modelName].findMany();
  
  const updates = {};
  for (const record of records) {
    const recordCopy = JSON.parse(JSON.stringify(record));
    updates[`${collectionName}/${record.id}`] = recordCopy;
  }
  await rtdb.ref().update(updates);
  console.log(`Migrated ${records.length} ${modelName} to RTDB.`);
}

async function main() {
  try {
    await deleteFromFirestore();

    await migrateUsers();
    await migrateLessons();
    await migrateStandalone('learningPath', 'learningPaths');
    await migrateStandalone('skillChallenge', 'skillChallenges');
    await migrateStandalone('reward', 'rewards');
    await migrateStandalone('emailVerificationToken', 'emailVerificationTokens');
    await migrateStandalone('passwordResetToken', 'passwordResetTokens');
    
    console.log('RTDB Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
