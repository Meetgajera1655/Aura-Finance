import { rtdb } from '../../apps/backend/src/config/firebase';
import { Request, Response } from 'express';
import { logger } from '../../apps/backend/src/utils/logger';

// Get all lessons
export async function getLessons(req: Request, res: Response) {
  try {
    const snapshot = await rtdb.ref('lessons').once('value');
    const data = snapshot.val();
    const lessons = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    res.status(200).json({ lessons });
  } catch (error) {
    logger.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
}

// Get lesson by ID
export async function getLessonById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const snapshot = await rtdb.ref(`lessons/${id}`).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Lesson not found' });
    
    const lesson = { id, ...snapshot.val() };
    res.status(200).json({ lesson });
  } catch (error) {
    logger.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
}

// Create lesson
export async function createLesson(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      duration,
      xpReward,
      category,
      icon,
      learningPathId,
    } = req.body;
    
    const ref = rtdb.ref('lessons').push();
    const lessonData = {
      title,
      description,
      duration,
      xpReward,
      category,
      icon,
      learningPathId,
    };
    
    await ref.set(lessonData);
    const lesson = { id: ref.key, ...lessonData };
    res.status(201).json({ lesson });
  } catch (error) {
    logger.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
}

// Update lesson
export async function updateLesson(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ref = rtdb.ref(`lessons/${id}`);
    await ref.update(req.body);
    const snapshot = await ref.once('value');
    const lesson = { id, ...snapshot.val() };
    res.status(200).json({ lesson });
  } catch (error) {
    logger.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
}

// Delete lesson
export async function deleteLesson(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await rtdb.ref(`lessons/${id}`).remove();
    res.status(204).end();
  } catch (error) {
    logger.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
}
