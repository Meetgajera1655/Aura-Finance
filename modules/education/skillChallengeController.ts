import { Request, Response } from 'express';
import { rtdb } from '../../apps/backend/src/config/firebase';
import { logger } from '../../apps/backend/src/utils/logger';

// Get all skill challenges
export async function getSkillChallenges(req: Request, res: Response) {
  try {
    const snapshot = await rtdb.ref('skillChallenges').once('value');
    const data = snapshot.val();
    const challenges = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    res.status(200).json({ challenges });
  } catch (error) {
    logger.error('Error fetching skill challenges:', error);
    res.status(500).json({ error: 'Failed to fetch skill challenges' });
  }
}

// Get skill challenge by ID
export async function getSkillChallengeById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const snapshot = await rtdb.ref(`skillChallenges/${id}`).once('value');
    if (!snapshot.exists())
      return res.status(404).json({ error: 'Skill challenge not found' });
    const challenge = { id, ...snapshot.val() };
    res.status(200).json({ challenge });
  } catch (error) {
    logger.error('Error fetching skill challenge:', error);
    res.status(500).json({ error: 'Failed to fetch skill challenge' });
  }
}

// Create skill challenge
export async function createSkillChallenge(req: Request, res: Response) {
  try {
    const { title, description, difficulty, xpReward } = req.body;
    const ref = rtdb.ref('skillChallenges').push();
    const challengeData = { title, description, difficulty, xpReward };
    await ref.set(challengeData);
    const challenge = { id: ref.key, ...challengeData };
    res.status(201).json({ challenge });
  } catch (error) {
    logger.error('Error creating skill challenge:', error);
    res.status(500).json({ error: 'Failed to create skill challenge' });
  }
}

// Update skill challenge
export async function updateSkillChallenge(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ref = rtdb.ref(`skillChallenges/${id}`);
    await ref.update(req.body);
    const snapshot = await ref.once('value');
    const challenge = { id, ...snapshot.val() };
    res.status(200).json({ challenge });
  } catch (error) {
    logger.error('Error updating skill challenge:', error);
    res.status(500).json({ error: 'Failed to update skill challenge' });
  }
}

// Delete skill challenge
export async function deleteSkillChallenge(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await rtdb.ref(`skillChallenges/${id}`).remove();
    res.status(204).end();
  } catch (error) {
    logger.error('Error deleting skill challenge:', error);
    res.status(500).json({ error: 'Failed to delete skill challenge' });
  }
}
