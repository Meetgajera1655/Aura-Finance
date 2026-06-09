import { Request, Response } from 'express';
import { logger } from '../../apps/backend/src/utils/logger';
import { rtdb } from '../../apps/backend/src/config/firebase';

const toArray = (obj: any) => obj ? Object.keys(obj).map(key => ({ id: key, ...obj[key] })) : [];

// Define progression tier type
interface ProgressionTier {
  key:
  | 'GURU'
  | 'EXPERT'
  | 'STRATEGIST'
  | 'INVESTOR'
  | 'PLANNER'
  | 'SAVER'
  | 'NOVICE';
  threshold: number;
}

// Utility: Calculate tier based on XP
const progressionTiers: ProgressionTier[] = [
  { key: 'GURU', threshold: 8500 },
  { key: 'EXPERT', threshold: 6000 },
  { key: 'STRATEGIST', threshold: 4000 },
  { key: 'INVESTOR', threshold: 2500 },
  { key: 'PLANNER', threshold: 1200 },
  { key: 'SAVER', threshold: 500 },
  { key: 'NOVICE', threshold: 0 },
];

function getTier(xp: number): ProgressionTier['key'] {
  for (const tier of progressionTiers) {
    if (xp >= tier.threshold) return tier.key;
  }
  return 'NOVICE';
}

// GET user gamification summary
export const getGamificationSummary = async (
  req: Request & { user: { id: string } },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    const snapshot = await rtdb.ref(`users/${userId}`).once('value');
    if (!snapshot.exists()) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = snapshot.val();
    const progressArray = toArray(user.educationProgress);
    const achievementsArray = toArray(user.achievements);
    const skillTreesArray = toArray(user.skillTrees);

    const xp = progressArray.reduce((sum, p) => sum + (p.xpEarned || 0), 0);
    const tier = getTier(xp);

    res.status(200).json({
      xp,
      tier,
      streak: user.dailyStreak || 0,
      achievements: achievementsArray,
      skillTrees: skillTreesArray,
      progress: progressArray,
    });
  } catch (error) {
    logger.error('Error getting gamification summary:', error);
    res.status(500).json({ error: 'Failed to retrieve gamification data' });
  }
};

// POST: Add XP for a completed lesson/quiz
export async function completeModule(
  req: Request & { user: { id: string } },
  res: Response
): Promise<void> {
  try {
    const userId = req.user.id;
    const { lessonId, xpEarned } = req.body;

    const snapshot = await rtdb.ref(`users/${userId}`).once('value');
    if (!snapshot.exists()) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const user = snapshot.val();

    // Upsert progress
    const progressRef = rtdb.ref(`users/${userId}/educationProgress/${lessonId}`);
    const progressData = {
      userId,
      lessonId,
      completed: true,
      xpEarned,
      completedAt: new Date().toISOString(),
    };
    await progressRef.set(progressData);

    const newStreak = (user.dailyStreak || 0) + 1;
    await rtdb.ref(`users/${userId}`).update({
      lastActiveDate: new Date().toISOString(),
      dailyStreak: newStreak,
    });

    res.status(200).json({
      success: true,
      progress: progressData,
      streak: newStreak,
      message: 'Module completed successfully',
    });
  } catch (error) {
    logger.error('Error completing module:', error);
    res.status(500).json({ error: 'Failed to complete module' });
  }
}

// POST: Add an achievement
export const addAchievement = async (
  req: Request & { user: { id: string } },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { type, title, description, color, requirement } = req.body;

    const achievementsRef = rtdb.ref(`users/${userId}/achievements`);
    const snapshot = await achievementsRef.orderByChild('type').equalTo(type).once('value');

    if (snapshot.exists()) {
      res.status(200).json({
        success: true,
        achievement: Object.values(snapshot.val())[0],
        message: 'Achievement already earned',
      });
      return;
    }

    const newAchievementRef = achievementsRef.push();
    const achievementData = { userId, type, title, description, color, requirement };
    await newAchievementRef.set(achievementData);

    res.status(201).json({ success: true, achievement: { id: newAchievementRef.key, ...achievementData } });
  } catch (error) {
    logger.error('Error adding achievement:', error);
    res.status(500).json({ error: 'Failed to add achievement' });
  }
};

// GET: All achievements for user
export const getAchievements = async (
  req: Request & { user: { id: string } },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const snapshot = await rtdb.ref(`users/${userId}/achievements`).once('value');
    res.status(200).json({ achievements: toArray(snapshot.val()) });
  } catch (error) {
    logger.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

// GET: User skill tree progress
export const getSkillTrees = async (
  req: Request & { user: { id: string } },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const snapshot = await rtdb.ref(`users/${userId}/skillTrees`).once('value');
    res.status(200).json({ skillTrees: toArray(snapshot.val()) });
  } catch (error) {
    logger.error('Error fetching skill trees:', error);
    res.status(500).json({ error: 'Failed to fetch skill trees' });
  }
};

// POST: Update skill tree progress
export const updateSkillTree = async (
  req: Request & { user: { id: string } },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { skillTreeId, progress } = req.body;

    const skillTreeRef = rtdb.ref(`users/${userId}/skillTrees/${skillTreeId}`);
    const data = { userId, skillTreeId, progress };
    await skillTreeRef.set(data);

    res.status(200).json({ success: true, updated: data });
  } catch (error) {
    logger.error('Error updating skill tree:', error);
    res.status(500).json({ error: 'Failed to update skill tree' });
  }
};
