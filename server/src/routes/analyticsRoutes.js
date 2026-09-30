import { Router } from 'express';
import {
  getOverview,
  getCategories,
  getDepartments,
  getPriorities,
  getSlaMetrics,
  getRecurring,
  getTrends
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/overview', getOverview);
router.get('/categories', getCategories);
router.get('/departments', getDepartments);
router.get('/priorities', getPriorities);
router.get('/sla', getSlaMetrics);
router.get('/recurring', getRecurring);
router.get('/trends', getTrends);

export default router;
