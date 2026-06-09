import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import globalErrorHandler from './middleware/globalErrorHandler';
import passport from 'passport';
import passportConfig from './config/passport';
import {
  helmetConfig,
  generalRateLimit,
  authRateLimit,
  getCorsConfig,
  additionalSecurityHeaders,
} from './config/security';
import authRouter from '../../../modules/auth/authRoute';
import newsRouter from '../../../modules/ai/newsRoute';
import currencyRouter from './CurrencyConvertor/currencyRoutes';
import { getChatbotResponse } from '../../../modules/ai/financeController';
import gamificationRoute from '../../../modules/education/gamificationRoute';
import lessonRoute from '../../../modules/education/lessonRoute';
import quizRoute from '../../../modules/education/quizRoute';
import flashcardRoute from '../../../modules/education/flashcardRoute';
import learningPathRoute from '../../../modules/education/learningPathRoute';
import skillChallengeRoute from '../../../modules/education/skillChallengeRoute';
import userStatsRoute from '../../../modules/education/userStatsRoute';
import rewardRoute from '../../../modules/education/rewardRoute';

config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

app.use(helmetConfig);
app.use(additionalSecurityHeaders);
app.use(generalRateLimit);

app.use(cors(getCorsConfig()));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use(passport.initialize());
passportConfig(passport);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Finance App Express Backend',
  });
});

app.use('/api/v1/auth', authRateLimit, authRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/currency', currencyRouter);
app.use('/api/v1/financechatbot', getChatbotResponse);

app.use('/api/v1/education/lesson', lessonRoute);
app.use('/api/v1/education/quiz', quizRoute);
app.use('/api/v1/education/flashcard', flashcardRoute);
app.use('/api/v1/education/learning-path', learningPathRoute);
app.use('/api/v1/education/skill-challenge', skillChallengeRoute);
app.use('/api/v1/education/reward', rewardRoute);
app.use('/api/v1/education/gamification', gamificationRoute);
app.use('/api/v1/education/stats', userStatsRoute);
app.use(globalErrorHandler);

export { server, io };
