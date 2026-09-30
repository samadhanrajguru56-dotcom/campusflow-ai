import { Router } from 'express';
import {
  getRules,
  createRule,
  updateRule,
  runAutomation,
  getLogs
} from '../controllers/automationController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { workflowRuleSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.get('/rules', getRules);
router.post('/rules', validate(workflowRuleSchema), createRule);
router.patch('/rules/:id', updateRule);
router.post('/run', runAutomation);
router.get('/logs', getLogs);

export default router;
