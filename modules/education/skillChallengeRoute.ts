import { RequestHandler, Router } from 'express';
import {
  getSkillChallenges,
  getSkillChallengeById,
  createSkillChallenge,
  updateSkillChallenge,
  deleteSkillChallenge,
} from './skillChallengeController';
import {
  skillChallengeIdParamSchema,
  createSkillChallengeSchema,
  updateSkillChallengeSchema,
} from '../../apps/backend/src/validator/skillChallengeValidator';
import { validateRequest } from '../../apps/backend/src/middleware/validateRequest';
const router = Router();

router.get('/', getSkillChallenges);
router.get('/:id',validateRequest(skillChallengeIdParamSchema, "params"), getSkillChallengeById as RequestHandler);
router.post('/',  validateRequest(createSkillChallengeSchema),createSkillChallenge);
router.patch('/:id',  validateRequest(skillChallengeIdParamSchema, "params"),
  validateRequest(updateSkillChallengeSchema as any), updateSkillChallenge);
router.delete('/:id', validateRequest(skillChallengeIdParamSchema,"params"),deleteSkillChallenge);

export default router;
