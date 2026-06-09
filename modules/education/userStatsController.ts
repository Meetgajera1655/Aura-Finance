import { Request, Response } from 'express';
import { logger } from '../../apps/backend/src/utils/logger';
import { rtdb } from '../../apps/backend/src/config/firebase';

const toArray = (obj: any) => obj ? Object.keys(obj).map(key => ({ id: key, ...obj[key] })) : [];

// Helper function to determine rank based on level
function determineRank(level: number): string {
  if (level >= 10) return 'Finance Guru';
  if (level >= 7) return 'Budget Master';
  if (level >= 5) return 'Money Manager';
  if (level >= 3) return 'Financial Student';
  return 'Finance Novice';
}

// GET: Retrieve user stats
export async function getUserStats(
  req: Request & { user: { id: string } },
  res: Response
) {
  try {
    const userId = req.user.id;

    const snapshot = await rtdb.ref(`users/${userId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = snapshot.val();
    const progressArray = toArray(user.educationProgress);
    const achievementsArray = toArray(user.achievements);

    // Calculate derived stats
    const completedLessons = progressArray.filter((p: any) => p.completed).length;
    const totalXp = user.xp || 0;

    // Calculate XP required for next level (simple formula - can be adjusted)
    const xpRequired = (user.level || 1) * 1000;

    // Determine rank based on level or other metrics
    const currentRank = determineRank(user.level || 1);

    const stats = {
      level: user.level || 1,
      xp: totalXp,
      xpRequired: xpRequired,
      streak: user.dailyStreak || 0,
      lessons: completedLessons,
      achievements: achievementsArray.length,
      currentRank: user.currentRank || currentRank,
      lastActiveDate: user.lastActiveDate,
    };

    res.status(200).json(stats);
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
}

// PUT: Update user stats
export async function updateUserStats(
  req: Request & { user: { id: string } },
  res: Response
) {
  try {
    const userId = req.user.id;
    const { xp, level, dailyStreak, currentRank } = req.body;

    const updates: any = { lastActiveDate: new Date().toISOString() };
    if (xp !== undefined) updates.xp = xp;
    if (level !== undefined) updates.level = level;
    if (dailyStreak !== undefined) updates.dailyStreak = dailyStreak;
    if (currentRank !== undefined) updates.currentRank = currentRank;

    await rtdb.ref(`users/${userId}`).update(updates);
    const snapshot = await rtdb.ref(`users/${userId}`).once('value');
    const updatedUser = snapshot.val();

    res.status(200).json({
      message: 'User stats updated successfully',
      user: {
        id: userId,
        level: updatedUser.level,
        xp: updatedUser.xp,
        dailyStreak: updatedUser.dailyStreak,
        currentRank: updatedUser.currentRank,
      },
    });
  } catch (error) {
    logger.error('Error updating user stats:', error);
    res.status(500).json({ error: 'Failed to update user stats' });
  }
}

// POST: Add XP and check for level up
export async function addXpAndCheckLevelUp(
  req: Request & { user: { id: string } },
  res: Response
) {
  try {
    const userId = req.user.id;
    const { xpAmount } = req.body;

    if (!xpAmount || xpAmount <= 0) {
      return res.status(400).json({ error: 'Invalid XP amount' });
    }

    const snapshot = await rtdb.ref(`users/${userId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = snapshot.val();

    // Calculate new XP and level
    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;

    const newXp = currentXp + xpAmount;
    let newLevel = currentLevel;
    let leveled = false;

    // Simple level up logic
    const xpNeeded = currentLevel * 1000;
    if (newXp >= xpNeeded) {
      newLevel += 1;
      leveled = true;
    }

    // Update user
    const updates = {
      xp: newXp,
      level: newLevel,
      lastActiveDate: new Date().toISOString(),
    };
    await rtdb.ref(`users/${userId}`).update(updates);

    // Response includes level up info
    res.status(200).json({
      updatedUser: { id: userId, ...user, ...updates },
      message: 'XP added successfully',
      xpAdded: xpAmount,
      newXp: newXp,
      newLevel: newLevel,
      leveledUp: leveled,
    });
  } catch (error) {
    logger.error('Error adding XP:', error);
    res.status(500).json({ error: 'Failed to add XP' });
  }
}

// GET: Reset daily streak if user hasn't been active
export async function checkAndUpdateStreak(
  req: Request & { user: { id: string } },
  res: Response
) {
  try {
    const userId = req.user.id;

    const snapshot = await rtdb.ref(`users/${userId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = snapshot.val();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    const currentTime = new Date();
    let updatedStreak = user.dailyStreak || 0;
    let streakReset = false;

    // Check if lastActive exists and is more than 24 hours ago
    if (lastActive) {
      const hoursSinceActive =
        (currentTime.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

      if (hoursSinceActive > 48) {
        // More than 48 hours - reset streak
        updatedStreak = 0;
        streakReset = true;
      }
    }

    // Update lastActiveDate
    await rtdb.ref(`users/${userId}`).update({
      lastActiveDate: currentTime.toISOString(),
      dailyStreak: updatedStreak,
    });

    res.status(200).json({
      currentStreak: updatedStreak,
      streakReset,
      lastActive: currentTime.toISOString(),
    });
  } catch (error) {
    logger.error('Error checking streak:', error);
    res.status(500).json({ error: 'Failed to check streak' });
  }
}

// Keep the existing function
export async function getFlashcardDecks(
  req: Request & { user: { id: string } },
  res: Response
) {
  try {
    const userId = req.user.id;
    const snapshot = await rtdb.ref(`users/${userId}`).once('value');
    res.status(200).json({ decks: { id: userId, ...snapshot.val() } });
  } catch (error) {
    logger.error('Error fetching flashcard decks:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard decks' });
  }
}
