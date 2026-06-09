import { PrismaClient } from '@prisma/client';
import { admin, db } from './src/config/firebase';

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('Migrating Users...');
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
      educationProgress: true,
      achievements: true,
      skillTrees: true,
    }
  });

  const batchSize = 100;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = db.batch();
    const currentUsers = users.slice(i, i + batchSize);

    for (const user of currentUsers) {
      const userRef = db.collection('users').doc(user.id);
      
      const userData = { ...user };
      
      // Remove relations from base doc
      delete (userData as any).accounts;
      delete (userData as any).educationProgress;
      delete (userData as any).achievements;
      delete (userData as any).skillTrees;

      batch.set(userRef, userData);

      // Add subcollections
      for (const acc of user.accounts) {
        batch.set(userRef.collection('accounts').doc(acc.id), acc);
      }
      for (const progress of user.educationProgress) {
        batch.set(userRef.collection('educationProgress').doc(progress.id), progress);
      }
      for (const achievement of user.achievements) {
        batch.set(userRef.collection('achievements').doc(achievement.id), achievement);
      }
      for (const tree of user.skillTrees) {
        batch.set(userRef.collection('skillTrees').doc(tree.id), tree);
      }
    }
    await batch.commit();
    console.log(`Migrated ${Math.min(i + batchSize, users.length)} / ${users.length} users`);
  }
}

async function migrateLessons() {
  console.log('Migrating Lessons...');
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

  for (const lesson of lessons) {
    const lessonRef = db.collection('lessons').doc(lesson.id);
    
    const lessonData = { ...lesson };
    delete (lessonData as any).quizzes;
    delete (lessonData as any).flashcardDecks;

    await lessonRef.set(lessonData);

    for (const quiz of lesson.quizzes) {
      const quizRef = lessonRef.collection('quizzes').doc(quiz.id);
      const quizData = { ...quiz };
      delete (quizData as any).questions;
      await quizRef.set(quizData);
      
      for (const question of quiz.questions) {
        await quizRef.collection('questions').doc(question.id).set(question);
      }
    }

    for (const deck of lesson.flashcardDecks) {
      const deckRef = lessonRef.collection('flashcardDecks').doc(deck.id);
      const deckData = { ...deck };
      delete (deckData as any).flashcards;
      await deckRef.set(deckData);

      for (const card of deck.flashcards) {
        await deckRef.collection('flashcards').doc(card.id).set(card);
      }
    }
  }
  console.log(`Migrated ${lessons.length} lessons`);
}

async function migrateStandalone(modelName: string, collectionName: string) {
  console.log(`Migrating ${modelName}...`);
  // @ts-ignore
  const records = await prisma[modelName].findMany();
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = db.batch();
    const currentRecords = records.slice(i, i + batchSize);
    for (const record of currentRecords) {
      batch.set(db.collection(collectionName).doc(record.id), record);
    }
    await batch.commit();
  }
  console.log(`Migrated ${records.length} ${modelName}`);
}

async function main() {
  try {
    await migrateUsers();
    await migrateLessons();
    await migrateStandalone('learningPath', 'learningPaths');
    await migrateStandalone('skillChallenge', 'skillChallenges');
    await migrateStandalone('reward', 'rewards');
    await migrateStandalone('emailVerificationToken', 'emailVerificationTokens');
    await migrateStandalone('passwordResetToken', 'passwordResetTokens');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
