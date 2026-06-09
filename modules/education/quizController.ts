import { Request, Response } from 'express';
import { logger } from '../../apps/backend/src/utils/logger';
import { rtdb } from '../../apps/backend/src/config/firebase';

// Helper to arrayify Firebase objects
const toArray = (obj: any) => obj ? Object.keys(obj).map(key => ({ id: key, ...obj[key] })) : [];

// Get all quizzes
export async function getQuizzes(req: Request, res: Response) {
  try {
    const snapshot = await rtdb.ref('quizzes').once('value');
    const quizzes = toArray(snapshot.val());
    res.status(200).json({ quizzes });
  } catch (error) {
    logger.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
}

// Get quiz by ID
export async function getQuizById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const snapshot = await rtdb.ref(`quizzes/${id}`).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Quiz not found' });
    const quiz = { id, ...snapshot.val() };
    if (quiz.questions) quiz.questions = toArray(quiz.questions);
    res.status(200).json({ quiz });
  } catch (error) {
    logger.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
}

// Create quiz
export async function createQuiz(req: Request, res: Response) {
  try {
    const { lessonId, title, description, xpReward, questions } = req.body;
    const ref = rtdb.ref('quizzes').push();
    
    // Convert questions array to object keyed by push ID
    const questionsObj: any = {};
    if (questions && Array.isArray(questions)) {
      questions.forEach((q: any) => {
        const qRef = rtdb.ref().push(); // generate unique ID
        questionsObj[qRef.key as string] = q;
      });
    }

    const data = {
      lessonId, title, description, xpReward,
      questions: questionsObj,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await ref.set(data);
    res.status(201).json({ quiz: { id: ref.key, ...data, questions: toArray(questionsObj) } });
  } catch (error) {
    logger.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
}

// Update quiz
export async function updateQuiz(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = { ...req.body, updatedAt: new Date().toISOString() };
    await rtdb.ref(`quizzes/${id}`).update(data);
    
    const snapshot = await rtdb.ref(`quizzes/${id}`).once('value');
    const quiz = { id, ...snapshot.val() };
    if (quiz.questions) quiz.questions = toArray(quiz.questions);
    
    res.status(200).json({ quiz });
  } catch (error) {
    logger.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
}

// Delete quiz
export async function deleteQuiz(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await rtdb.ref(`quizzes/${id}`).remove();
    res.status(204).end();
  } catch (error) {
    logger.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
}

// Submit quiz answers
export async function submitQuiz(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { answers } = req.body; // [{questionId, answerIndex}]
    const snapshot = await rtdb.ref(`quizzes/${id}`).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Quiz not found' });
    
    const quiz = snapshot.val();
    const questions = toArray(quiz.questions);
    
    let score = 0;
    questions.forEach((q: any) => {
      const userAnswer = answers.find((a: any) => a.questionId === q.id);
      if (userAnswer && userAnswer.answerIndex === q.correctAnswer) score++;
    });
    res.status(200).json({ score, total: questions.length });
  } catch (error) {
    logger.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
}
