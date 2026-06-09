import { logger } from './utils/logger';
import { rtdb } from './config/firebase';

export const setupDb = async () => {
  try {
    // Simple check to ensure RTDB is initialized
    await rtdb.ref('.info/connected').once('value');
    logger.info('Database connection established: Using Firebase Realtime Database');
  } catch (error) {
    logger.error('Failed to connect to Firebase Realtime Database.', error);
    process.exit(1);
  }
};
