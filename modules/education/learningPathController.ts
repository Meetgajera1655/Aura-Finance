import { Request, Response } from 'express';
import { logger } from '../../apps/backend/src/utils/logger';
import { rtdb } from '../../apps/backend/src/config/firebase';

const toArray = (obj: any) => obj ? Object.keys(obj).map(key => ({ id: key, ...obj[key] })) : [];

// Get all learning paths
export async function getLearningPaths(req: Request, res: Response) {
  try {
    const snapshot = await rtdb.ref('learningPaths').once('value');
    const paths = toArray(snapshot.val());
    res.status(200).json({ paths });
  } catch (error) {
    logger.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
}

// Get learning path by ID
export async function getLearningPathById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const snapshot = await rtdb.ref(`learningPaths/${id}`).once('value');
    if (!snapshot.exists())
      return res.status(404).json({ error: 'Learning path not found' });
    
    const path = { id, ...snapshot.val() };
    res.status(200).json({ path });
  } catch (error) {
    logger.error('Error fetching learning path:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
}

// Create learning path
export async function createLearningPath(req: Request, res: Response) {
  try {
    const { title, color, icon } = req.body;
    const ref = rtdb.ref('learningPaths').push();
    const data = { title, color, icon, createdAt: new Date().toISOString() };
    await ref.set(data);
    res.status(201).json({ path: { id: ref.key, ...data } });
  } catch (error) {
    logger.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
}

// Update learning path
export async function updateLearningPath(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await rtdb.ref(`learningPaths/${id}`).update(req.body);
    const snapshot = await rtdb.ref(`learningPaths/${id}`).once('value');
    res.status(200).json({ path: { id, ...snapshot.val() } });
  } catch (error) {
    logger.error('Error updating learning path:', error);
    res.status(500).json({ error: 'Failed to update learning path' });
  }
}

// Delete learning path
export async function deleteLearningPath(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await rtdb.ref(`learningPaths/${id}`).remove();
    res.status(204).end();
  } catch (error) {
    logger.error('Error deleting learning path:', error);
    res.status(500).json({ error: 'Failed to delete learning path' });
  }
}
