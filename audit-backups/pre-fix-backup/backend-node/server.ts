import { config } from 'dotenv';
import { logger } from './src/utils/logger';
import { setupDb } from './src/dbSetup';

config();

const startServer = async () => {
  await setupDb();

  // Import app after DB setup so Prisma picks up the DATABASE_URL
  const { io, server } = await import('./src/app');

  const port = process.env.PORT || 5050;

  server.listen(port, () => {
    logger.info(`Listening on port: ${port}`);
  });

  io.on('connection', socket => {
    logger.info('New client connected');
    socket.on('disconnect', () => {
      logger.info('Client disconnected');
    });
  });
};

startServer();
