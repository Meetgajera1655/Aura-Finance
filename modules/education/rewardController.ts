import { rtdb } from '../../apps/backend/src/config/firebase';
import { Request, Response } from 'express';
import { logger } from '../../apps/backend/src/utils/logger';

// Get all rewards
export async function getRewards(req: Request, res: Response) {
  try {
    const snapshot = await rtdb.ref('rewards').once('value');
    const data = snapshot.val();
    const rewards = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    res.status(200).json({ rewards });
  } catch (error) {
    logger.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
}

// Get reward by ID
export async function getRewardById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const snapshot = await rtdb.ref(`rewards/${id}`).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Reward not found' });
    const reward = { id, ...snapshot.val() };
    res.status(200).json({ reward });
  } catch (error) {
    logger.error('Error fetching reward:', error);
    res.status(500).json({ error: 'Failed to fetch reward' });
  }
}
