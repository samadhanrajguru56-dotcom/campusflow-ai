import { Router } from 'express';
import {
  analyze,
  detectDuplicate,
  priorityCheck,
  assignmentCheck,
  generateReport,
  getInsights
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/analyze', analyze);
router.post('/detect-duplicate', detectDuplicate);
router.post('/priority', priorityCheck);
router.post('/assignment', assignmentCheck);
router.post('/generate-report', generateReport);
router.get('/insights', getInsights);

export default router;
