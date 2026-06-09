import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { logger } from '../../apps/backend/src/utils/logger';
import { InternalServerError } from '../../apps/backend/src/errors/errorTypes';

const getChatbotResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { query } = req.query;
  logger.debug('Finance chatbot request', { query });

  try {
    const response = await axios.get(
      `${process.env.PYTHON_BACKEND_URL}/chatbot/chat`,
      {
        params: { query },
      }
    );

    res.status(200).json({
      status: 'success',
      message: response.data,
    });
  } catch (err) {
    logger.error('Failed to fetch chatbot response', { error: err });
    return next(new InternalServerError('Error while processing your request'));
  }
};

export { getChatbotResponse };
