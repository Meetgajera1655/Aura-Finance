import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger';

const prisma = new PrismaClient();

export const setupDb = async () => {
  try {
    // Verify database connection on startup
    await prisma.$connect();
    logger.info('Database connection established: Using PostgreSQL defined in DATABASE_URL');
  } catch (error) {
    logger.error('Failed to connect to the database. Please ensure PostgreSQL is running.', error);
    process.exit(1); // Exit if DB is not reachable to avoid cryptic errors later
  }
};
