import { RequestHandler, Router } from 'express';
import { getRewards, getRewardById } from './rewardController';
import { rewardIdParamSchema } from '../../apps/backend/src/validator/rewardValidator';
import { validateRequest } from '../../apps/backend/src/middleware/validateRequest';
const router = Router();

router.get('/', getRewards);
router.get('/:id', validateRequest(rewardIdParamSchema, "params"),getRewardById as RequestHandler);

export default router;
