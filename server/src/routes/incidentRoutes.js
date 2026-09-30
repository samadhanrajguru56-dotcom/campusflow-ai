import { Router } from 'express';
import {
  getIncidents,
  getIncidentById,
  mergeTicketsIntoIncident,
  updateIncident
} from '../controllers/incidentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/:id/merge', mergeTicketsIntoIncident);
router.patch('/:id', updateIncident);

export default router;
